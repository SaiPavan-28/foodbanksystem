import React, { useState } from 'react';
import { X, Award, CheckCircle2, AlertCircle, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';
import { QuizQuestion } from '../types/foodbridge';
import { useFoodBridge } from '../context/FoodBridgeContext';
import confetti from 'canvas-confetti';

interface VolunteerQuizModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the maximum time window ('Golden Hour') recommended for redistributing freshly cooked hot food?",
    options: [
      "Within 12 to 24 hours",
      "Within 2 to 4 hours of preparation",
      "Whenever the volunteer is free",
      "Up to 2 days if kept covered"
    ],
    correctAnswer: 1,
    explanation: "Hot cooked food should be consumed or safely distributed within 2 to 4 hours to prevent bacterial growth."
  },
  {
    id: 2,
    question: "Which of the following food safety checks is mandatory before taking pickup photos?",
    options: [
      "Verifying packaging integrity & clean thermal covering",
      "Adding extra salt to preserve food",
      "Tasting the food directly with unwashed hands",
      "Storing cooked food in open plastic bags"
    ],
    correctAnswer: 0,
    explanation: "Food must be securely packed in clean containers with thermal covering to maintain hygiene during transit."
  },
  {
    id: 3,
    question: "If NGO shelter capacity is fully booked when you arrive with surplus food, what is the correct protocol?",
    options: [
      "Discard the food in a nearby bin",
      "Return the food back to the donor",
      "Use the FoodBridge Fallback Routing feature to deliver to verified needy families/shelters",
      "Keep the food for personal use"
    ],
    correctAnswer: 2,
    explanation: "FoodBridge automatically triggers Fallback Routing to redirect surplus food to nearby verified families or secondary shelters."
  },
  {
    id: 4,
    question: "Why does FoodBridge batch small donations (< 5kg) into single multi-stop volunteer trips?",
    options: [
      "To reject small donations from individuals",
      "To optimize volunteer routes and prevent small surplus rejections",
      "To charge donors extra delivery fees",
      "To slow down the delivery process"
    ],
    correctAnswer: 1,
    explanation: "Small-quantity pooling combines multiple small food offers into one efficient trip, saving volunteer fuel and preventing rejection."
  }
];

export const VolunteerQuizModal: React.FC<VolunteerQuizModalProps> = ({ onClose, onSuccess }) => {
  const { passVolunteerQuiz } = useFoodBridge();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const handleSelectOption = (qId: number, optIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: optIndex }));
  };

  const handleNext = () => {
    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Grade quiz
      let correct = 0;
      QUIZ_QUESTIONS.forEach(q => {
        if (selectedAnswers[q.id] === q.correctAnswer) {
          correct += 1;
        }
      });
      const pct = Math.round((correct / QUIZ_QUESTIONS.length) * 100);
      setScore(pct);
      setSubmitted(true);

      if (pct >= 75) {
        passVolunteerQuiz(pct);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    }
  };

  const currentQ = QUIZ_QUESTIONS[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-teal-500/40 text-slate-100 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-950 border border-teal-600 rounded-2xl text-[#84CC16]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">Volunteer Qualification Quiz</h2>
              <p className="text-xs text-teal-300 font-medium">Complete test to unlock active field rescue status (Pass mark: 75%)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!submitted ? (
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400 font-bold">
                <span>Question {currentStep + 1} of {QUIZ_QUESTIONS.length}</span>
                <span>{Math.round(((currentStep + 1) / QUIZ_QUESTIONS.length) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-[#84CC16] transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white leading-snug">{currentQ.question}</h3>

              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedAnswers[currentQ.id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(currentQ.id, idx)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-teal-950/80 border-[#84CC16] text-[#84CC16] ring-1 ring-[#84CC16]/40'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span>{opt}</span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
                        isSelected ? 'border-[#84CC16] bg-[#84CC16] text-slate-950 font-bold' : 'border-slate-700'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Next / Submit Button */}
            <button
              disabled={selectedAnswers[currentQ.id] === undefined}
              onClick={handleNext}
              className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-[#0D9488] hover:from-teal-500 hover:to-[#0F766E] disabled:opacity-50 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all"
            >
              {currentStep < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'Submit Quiz & Verify Status'}
            </button>
          </div>
        ) : (
          <div className="text-center space-y-6 py-4">
            {score >= 75 ? (
              <>
                <div className="w-20 h-20 bg-emerald-950 border-4 border-[#84CC16] text-[#84CC16] rounded-full flex items-center justify-center mx-auto shadow-xl">
                  <Sparkles className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#84CC16]">Congratulations!</span>
                  <h3 className="text-2xl font-black text-white">Qualification Passed ({score}%)</h3>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto">
                    You have successfully passed the Food Safety & Golden Hour Protocol test. You are now officially verified for active dispatch missions!
                  </p>
                </div>

                <button
                  onClick={() => {
                    onSuccess();
                    onClose();
                  }}
                  className="w-full py-4 bg-[#84CC16] hover:bg-lime-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl transition-all"
                >
                  Enter Volunteer Dashboard
                </button>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-rose-950 border-4 border-rose-600 text-rose-400 rounded-full flex items-center justify-center mx-auto shadow-xl">
                  <AlertCircle className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white">Score: {score}% (Pass mark: 75%)</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Please review the food safety hygiene guide and try the quiz again to verify your volunteer eligibility.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSubmitted(false);
                    setCurrentStep(0);
                    setSelectedAnswers({});
                  }}
                  className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-2xl transition-all"
                >
                  Retake Quiz
                </button>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
