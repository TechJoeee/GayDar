'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import Image from 'next/image';

type Question = {
  id: number;
  prompt: string;
  options: { label: string; value: number; evidence: string }[];
};

type Subject = 'GUY' | 'GIRL';

const questions: Question[] = [
  {
    id: 1,
    prompt: 'You’re walking across campus and a fine {SUBJECT} walks past you. Your friend immediately says: “Omo, that {subject} fine sha.” What do you do?',
    options: [
      { label: '“I didn’t even notice.”', value: 0, evidence: 'Subject appears completely unbothered.' },
      { label: '“Yeah, they’re alright.”', value: 8, evidence: 'Subject has acknowledged the individual.' },
      { label: '“Which one?”', value: 15, evidence: 'Subject requested additional information.' },
      { label: '“Where?” 👀', value: 22, evidence: 'Subject requested additional information very quickly.' },
      { label: '“You noticed too?”', value: 25, evidence: 'Subject appears unusually interested in the investigation.' },
    ],
  },
  {
    id: 2,
    prompt: 'Your friend sends you a picture of a fine {SUBJECT} and says: “Bro, rate this {subject}.” What are you doing?',
    options: [
      { label: '“You rate them yourself.”', value: 0, evidence: 'Subject responded normally.' },
      { label: '“7/10.”', value: 7, evidence: 'Subject provided an unsolicited rating.' },
      { label: '“Why are you asking me this?”', value: 10, evidence: 'Subject appears suspiciously defensive.' },
      { label: '“Wait, send the picture again.”', value: 20, evidence: 'Subject requested a second viewing.' },
      { label: 'Zoom in before answering. 💀', value: 25, evidence: 'SUBJECT ZOOMED IN. EXHIBIT A.' },
    ],
  },
  {
    id: 3,
    prompt: 'You’re at a Nigerian wedding and a fine {SUBJECT} walks past wearing an absolutely crazy outfit. Your friend whispers: “That {subject} is fresh.” You…',
    options: [
      { label: 'Keep eating jollof.', value: 0, evidence: 'Subject prioritised jollof.' },
      { label: 'Say “true” and continue eating.', value: 5, evidence: 'Subject noticed the outfit.' },
      { label: 'Look at the outfit.', value: 10, evidence: 'Subject has acknowledged the target.' },
      { label: 'Look at the {subject}. 👀', value: 18, evidence: 'Subject performed a visual inspection.' },
      { label: 'Turn around to look again.', value: 25, evidence: 'THE SECOND LOOK HAS BEEN LOGGED.' },
    ],
  },
  {
    id: 4,
    prompt: 'You’re chilling with your {subject}s when someone points at a fine {SUBJECT} across the room and says: “Would you talk to that {subject} if they came over?” What do you say?',
    options: [
      { label: '“No.”', value: 0, evidence: 'Subject immediately rejected the allegation.' },
      { label: '“I don’t know.”', value: 5, evidence: 'Subject remains undecided.' },
      { label: '“Maybe.”', value: 12, evidence: 'Subject has left the door slightly open.' },
      { label: '“Depends if they’re cool.”', value: 18, evidence: 'Subject introduced personality requirements.' },
      { label: '“Why, are you trying to introduce us?” 💀', value: 25, evidence: 'Subject has begun investigating the investigator.' },
    ],
  },
  {
    id: 5,
    prompt: 'Your friend points at a fine {SUBJECT} and says: “Be honest. If that {subject} asked you on a date right now, what would you say?”',
    options: [
      { label: '“Absolutely not.”', value: 0, evidence: 'Case appears straightforward.' },
      { label: '“I’d probably say no.”', value: 5, evidence: 'Subject remains cautious.' },
      { label: '“Depends.”', value: 12, evidence: 'Subject has refused to cooperate.' },
      { label: '“I’d hear them out.”', value: 20, evidence: 'Subject is willing to hear the proposal.' },
      { label: '“Why are you asking me so many questions?” 😭', value: 25, evidence: 'SUBJECT HAS QUESTIONED THE INVESTIGATION. VERY INTERESTING.' },
    ],
  },
];

const results = [
  { threshold: 0, title: 'STRAIGHT AS A USB CABLE', subtitle: 'The Gay Radar found absolutely nothing. Congratulations, I guess.' },
  { threshold: 16, title: 'NOT GUILTY… FOR NOW', subtitle: 'The investigation has been suspended due to insufficient evidence.' },
  { threshold: 31, title: 'HMMM 🤨', subtitle: 'Nothing conclusive. But we have questions.' },
  { threshold: 46, title: 'THE RADAR IS CONFUSED', subtitle: 'Even the machine doesn’t know what it’s looking at anymore.' },
  { threshold: 61, title: 'BROTHER??? 💀', subtitle: 'The evidence department would like a word.' },
  { threshold: 76, title: 'EXTREMELY SUS', subtitle: 'The allegations are becoming difficult to ignore.' },
  { threshold: 91, title: 'GAYDAR GOING CRAZY 🚨', subtitle: 'Someone please check the radar. It is making concerning noises.' },
  { threshold: 100, title: 'YOU BROKE THE GAYDAR', subtitle: 'The equipment was not designed for this level of nonsense.' },
];

const scoreSamples = [
  { score: 62, label: 'soft launch', className: 'sample-pink', note: 'hmm' },
  { score: 88, label: 'very loud', className: 'sample-orange', note: 'interesting' },
  { score: 34, label: 'plot twist', className: 'sample-blue', note: 'okay then' },
  { score: 76, label: 'not beating it', className: 'sample-purple', note: 'behave' },
  { score: 47, label: 'jury is out', className: 'sample-green', note: 'abeg' },
];

export default function Home() {
  const [started, setStarted] = useState(false);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = questions[currentIndex];
  const totalScore = answers.reduce((sum, value) => sum + value, 0);
  const gayPercentage = Math.round((totalScore / 125) * 100);
  const straightPercentage = 100 - gayPercentage;

  const finalResult = useMemo(() => {
    return results.reduce((selected, result) => {
      return gayPercentage >= result.threshold ? result : selected;
    }, results[0]);
  }, [gayPercentage]);

  const evidence = useMemo(
    () =>
      answers
        .map((answer, index) => questions[index]?.options.find((option) => option.value === answer)?.evidence)
        .filter((item): item is string => Boolean(item))
        .slice(-4),
    [answers],
  );

  const progress = ((currentIndex + (showResult ? 1 : 0)) / questions.length) * 100;

  const handleAnswer = (value: number) => {
    const nextAnswers = [...answers, value];
    setAnswers(nextAnswers);

    if (currentIndex === questions.length - 1) {
      setShowResult(true);
      return;
    }

    setCurrentIndex(currentIndex + 1);
  };

  const resetQuiz = () => {
    setStarted(false);
    setSubject(null);
    setCurrentIndex(0);
    setAnswers([]);
    setShowResult(false);
  };

  return (
    <main className={`page-shell ${!started && !showResult ? 'landing-page' : ''}`}>
      <div className="background-noise" />

      {!started && !showResult && (
        <section className="hero-shell">
          <div className="hero-intro">
            <Image
              className="brand-logo"
              src="/gaydar-logo.webp"
              alt="GayDar"
              width={951}
              height={1024}
              priority
            />
            <h1>Explore your sexuality.<br /><em>Are you gay or not?</em></h1>
            <p className="hero-description">Five unserious questions. One suspiciously specific score.</p>

            <button className="cta-button" onClick={() => setStarted(true)}>
              CHECK ME
            </button>
          </div>

          <div className="sample-strip" aria-label="Example Gaydar scores">
            {scoreSamples.map((sample, index) => (
              <div
                className={`sample-card ${sample.className}`}
                key={sample.label}
                style={{ '--card-rotation': `${index % 2 === 0 ? -2 : 2}deg` } as CSSProperties}
              >
                <div className="sample-card-top">
                  <span>GAYDAR {String(index + 1).padStart(2, '0')}</span>
                  <span>{sample.note}</span>
                </div>
                <div className="sample-spinner" style={{ '--sample-score': `${sample.score * 3.6}deg` } as CSSProperties}>
                  <div className="sample-spinner-inner">
                    <strong>{sample.score}%</strong>
                    <small>gay-ish</small>
                  </div>
                </div>
                <strong className="sample-label">{sample.label}</strong>
              </div>
            ))}
          </div>
        </section>
      )}

      {started && !subject && !showResult && (
        <section className="setup-shell">
          <div className="quiz-card setup-card">
            <p className="question-tag">BEFORE WE BEGIN</p>
            <h2>Who are we investigating today?</h2>
            <p className="result-subtitle">Pick one so the Gaydar can stop being vague.</p>
            <div className="subject-grid">
              {(['GUY', 'GIRL'] as Subject[]).map((choice) => (
                <button
                  className="subject-button"
                  key={choice}
                  type="button"
                  onClick={() => setSubject(choice)}
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {started && subject && !showResult && currentQuestion && (
        <section className="quiz-shell">
          <div className="progress-track" aria-label="Quiz progress">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>

          <div className="quiz-card">
            <p className="question-tag">QUESTION {String(currentQuestion.id).padStart(2, '0')}</p>
            <h2>
              {currentQuestion.prompt
                .replaceAll('{SUBJECT}', subject)
                .replaceAll('{subject}', subject === 'GUY' ? 'guy' : 'girl')}
            </h2>

            <div className="options-grid">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  className="option-button"
                  onClick={() => handleAnswer(option.value)}
                >
                  {option.label
                    .replaceAll('{SUBJECT}', subject)
                    .replaceAll('{subject}', subject === 'GUY' ? 'guy' : 'girl')}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {showResult && (
        <section className="result-shell">
          <div className="result-card">
            <p className="result-score">GAYDAR READOUT · {totalScore}/125</p>
            <h2>{finalResult.title}</h2>
            <p className="result-subtitle">{finalResult.subtitle}</p>

            <div
              className="score-spinner"
              style={{ '--score-angle': `${gayPercentage * 3.6}deg` } as CSSProperties}
              aria-label={`${gayPercentage}% gay and ${straightPercentage}% straight, for entertainment only`}
            >
              <div className="score-spinner-inner">
                <strong>{gayPercentage}%</strong>
                <span>gay-ish</span>
              </div>
            </div>

            <div className="score-breakdown">
              <div className="straight-stat">
                <span className="score-dot straight-dot" />
                <strong>{straightPercentage}%</strong>
                <small>straight vibes</small>
              </div>
              <div className="gay-stat">
                <span className="score-dot gay-dot" />
                <strong>{gayPercentage}%</strong>
                <small>gay vibes</small>
              </div>
            </div>

            <p className="summary">
              Final verdict:{' '}
              <strong>
                {gayPercentage > 60
                  ? 'GAY AS FUCK.'
                  : gayPercentage >= 40
                    ? 'THE VIBES ARE UNCLEAR.'
                    : 'MOSTLY STRAIGHT VIBES.'}
              </strong>
            </p>

            <div className="evidence-list">
              <p className="evidence-heading">FAKE EVIDENCE</p>
              {evidence.map((item, index) => (
                <p key={`${item}-${index}`}>
                  EXHIBIT {String.fromCharCode(65 + index)}: {item}
                </p>
              ))}
            </div>

            <div className="result-actions">
              <button type="button" className="ghost-button" onClick={resetQuiz}>
                RETAKE
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
