import React, { useState } from 'react';
import { X, Award, CheckCircle2, AlertCircle, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';
import { QuizQuestion } from '../types/foodbridge';
import { useFoodBridge } from '../context/FoodBridgeContext';
import confetti from 'canvas-confetti';

interface VolunteerQuizModalProps {
  onClose: () => void;
  onSuccess: (score?: number) => void;
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
      "Discard the food in the nearest bin",
      "Return the food to the donor",
      "Use the FoodBridge Fallback Routing feature to reroute to the nearest high-density hunger hotspot",
      "Keep the food for personal use"
    ],
    correctAnswer: 2,
    explanation: "FoodBridge automatically provides automated fallback routing to secondary verified shelters when primary shelters reach max capacity."
  },
  {
    id: 4,
    question: "Why does FoodBridge batch small donations (< 5kg) into single multi-stop volunteer trips?",
    options: [
      "To delay food delivery",
      "To optimize volunteer routes and prevent small surplus rejections",
      "To charge extra fees to donors",
      "Because single pickups are prohibited"
    ],
    correctAnswer: 1,
    explanation: "Pooling small donations into a single batch trip ensures small surplus isn't turned down and optimizes volunteer mileage."
  }
];

export const VolunteerQuizModal: React.FC<VolunteerQuizModalProps> = ({ onClose, onSuccess }) => {
  const { passVolunteerQuiz } = useFoodBridge();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const currentQ = QUIZ_QUESTIONS[currentStep];

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: optionIndex }));
  };

  const handleNext = () => {
    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    QUIZ_QUESTIONS.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);
    setScore(percentage);
    setSubmitted(true);

    if (percentage >= 75) {
      passVolunteerQuiz(percentage);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-[#0F172A] border-2 border-teal-500 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-slate-100 relative space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-950 text-[#84CC16] border border-teal-600/60 rounded-2xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-white">Volunteer Qualification Test</h2>
              <p className="text-[10px] text-teal-300 uppercase font-bold tracking-wider">
                Food Safety & Golden Hour Protocol
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!submitted ? (
          <div className="space-y-6">
            {/* Progress indicator */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span>Question {currentStep + 1} of {QUIZ_QUESTIONS.length}</span>
              <span className="text-[#84CC16]">Pass mark: 75%</span>
            </div>

            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-[#84CC16] transition-all duration-300"
                style={{ width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <div className="space-y-4">
              <h3 className="font-bold text-base text-white leading-snug">
                {currentQ.question}
              </h3>

              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedAnswers[currentQ.id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-teal-950/90 border-[#84CC16] text-white shadow-lg ring-1 ring-[#84CC16]'
                          : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span>{opt}</span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                        isSelected ? 'bg-[#84CC16] border-[#84CC16] text-slate-950' : 'border-slate-700 text-transparent'
                      }`}>
                        ✓
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-400 disabled:opacity-30 rounded-xl text-xs font-bold"
              >
                Previous
              </button>

              {currentStep < QUIZ_QUESTIONS.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={selectedAnswers[currentQ.id] === undefined}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white font-extrabold text-xs rounded-xl shadow transition-all"
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={selectedAnswers[currentQ.id] === undefined}
                  className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-[#84CC16] hover:from-teal-400 hover:to-lime-400 disabled:opacity-40 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all"
                >
                  Submit Quiz & Verify Status
                </button>
              )}
            </div>
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
                    onSuccess(score);
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
