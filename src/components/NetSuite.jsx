// CHANGE VERSION: NETSUITE-CROSSHAIR-R1 | 2026-10-20 | Complete NetSuite.jsx
import { useEffect, useId, useRef, useState } from 'react';
import Crosshair from './Crosshair';
import { getAdaptiveAccent, subscribeAdaptiveAccent } from '../utils/adaptiveColors';
import '../styles/NetSuite.css';

// Keep the page content here so the skill areas can grow with the portfolio.
export const netsuiteFocusAreas = [
  {
    id: 'support', label: 'Technical support', code: '01', symbol: '?_',
    title: 'Get to the root of it.',
    summary: 'Start with the business impact. Follow the evidence. Make the next step clear.',
    points: [
      { title: 'Understand the issue', text: 'Clarify the expected result, the actual behavior, and who is affected.' },
      { title: 'Investigate with context', text: 'Trace the steps, compare working scenarios, and separate symptoms from the underlying problem.' },
      { title: 'Keep people informed', text: 'Turn technical findings into useful updates, practical next steps, and clear handovers.' },
    ],
    note: 'Clear questions → better investigation.',
  },
  {
    id: 'technical', label: 'Workflows & automation', code: '02', symbol: '{ }',
    title: 'Make the system make sense.',
    summary: 'Connect technical thinking with the day-to-day work the system needs to support.',
    points: [
      { title: 'Map the moving parts', text: 'Look at the records, conditions, and process steps involved before changing a workflow.' },
      { title: 'Find useful automation', text: 'Identify repetitive work and explore where a clearer workflow could reduce manual effort.' },
      { title: 'Check the outcome', text: 'Walk through the expected scenarios and document what changed, why, and what needs attention.' },
    ],
    note: 'Business intent → thoughtful implementation.',
  },
  {
    id: 'consulting', label: 'Business consulting', code: '03', symbol: '↳',
    title: 'Translate between both sides.',
    summary: 'Bridge the gap between a business request and a technical path forward.',
    points: [
      { title: 'Ask the right questions', text: 'Understand the goal behind a request, the current process, and the constraints that matter.' },
      { title: 'Shape the next step', text: 'Break a broad requirement into a focused problem, a sensible approach, and an expected result.' },
      { title: 'Make knowledge usable', text: 'Keep explanations, process notes, and follow-up actions clear enough for the next person to use.' },
    ],
    note: 'Shared understanding → a clearer way forward.',
  },
];

const supportProcess = [
  { title: 'Listen', detail: 'What should happen? What happens instead?' },
  { title: 'Trace', detail: 'Follow the process. Gather the useful details.' },
  { title: 'Work through', detail: 'Explore the cause and validate the next step.' },
  { title: 'Explain', detail: 'Share the outcome and leave a clear trail.' },
];

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>;
}

export default function NetSuite() {
  const [selected, setSelected] = useState(0);
  const [crosshairColor, setCrosshairColor] = useState(() => getAdaptiveAccent() || '#d8b97c');
  const sectionRef = useRef(null);
  const tabRefs = useRef([]);
  const uid = `netsuite-${useId().replace(/:/g, '')}`;

  useEffect(() => subscribeAdaptiveAccent(setCrosshairColor), []);

  const handleTabKey = (event, index) => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % netsuiteFocusAreas.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + netsuiteFocusAreas.length) % netsuiteFocusAreas.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = netsuiteFocusAreas.length - 1;
    else return;
    event.preventDefault();
    setSelected(next);
    tabRefs.current[next]?.focus();
  };

  return <section ref={sectionRef} id="netsuite" className="netsuite-page" aria-labelledby={`${uid}-title`}>
    <Crosshair containerRef={sectionRef} viewport color={crosshairColor}
      thickness={1} opacity={0.65} gap={14} fade={0.45} smoothing={0.3}
      targetEffect="lock" showCoordinates clickPulse hideCursor={false}
      className="netsuite-crosshair" style={{ zIndex: 3 }} />
    <div className="netsuite-page__intro">
      <div className="netsuite-page__intro-copy">
        <span className="netsuite-page__kicker">03 / ERP · TECHNICAL · SUPPORT</span>
        <h1 id={`${uid}-title`}>NetSuite<span>.</span></h1>
        <p className="netsuite-page__lead">Business context.<br /><em>Technical clarity.</em></p>
        <p className="netsuite-page__description">My ERP side: technical problem solving, workflow thinking, and support that keeps the person behind the question in focus.</p>
        <a className="netsuite-page__text-link" href="#contact">Let’s talk NetSuite<ArrowIcon /></a>
      </div>
      <aside className="netsuite-note" aria-label="My approach to NetSuite work" data-crosshair-target>
        <div className="netsuite-note__top"><span>THE WAY I THINK</span><span aria-hidden="true">✦</span></div>
        <p>Understand<br />the <em>why.</em><br /><span>Work on the how.</span></p>
        <div className="netsuite-note__diagram" aria-hidden="true"><span>people</span><i>+</i><span>process</span><i>+</i><span>systems</span></div>
        <span className="netsuite-note__foot">Practical answers. Human explanations.</span>
      </aside>
    </div>

    <div className="netsuite-focus" aria-labelledby={`${uid}-focus-title`}>
      <div className="netsuite-page__section-heading"><span className="netsuite-page__kicker">WHERE I FOCUS</span><h2 id={`${uid}-focus-title`}>Different angles.<br /><span>One connected approach.</span></h2></div>
      <div className="netsuite-focus__tabs" role="tablist" aria-label="Explore NetSuite skill areas">
        {netsuiteFocusAreas.map((area, index) => <button type="button" key={area.id}
          ref={node => { tabRefs.current[index] = node; }} id={`${uid}-tab-${area.id}`} role="tab"
          aria-selected={selected === index} aria-controls={`${uid}-panel-${area.id}`} tabIndex={selected === index ? 0 : -1}
          onClick={() => setSelected(index)} onKeyDown={event => handleTabKey(event, index)}>
          <span className="netsuite-focus__tab-number" aria-hidden="true">{area.code}</span><span>{area.label}</span><span className="netsuite-focus__tab-arrow" aria-hidden="true">↗</span>
        </button>)}
      </div>
      {netsuiteFocusAreas.map((area, index) => <div key={area.id} id={`${uid}-panel-${area.id}`} className="netsuite-focus__panel" role="tabpanel"
        aria-labelledby={`${uid}-tab-${area.id}`} tabIndex={0} hidden={selected !== index}>
        <div className="netsuite-focus__overview"><span className="netsuite-focus__symbol" aria-hidden="true">{area.symbol}</span><h3>{area.title}</h3><p>{area.summary}</p><span className="netsuite-focus__note">{area.note}</span></div>
        <ul className="netsuite-focus__points">{area.points.map((point, pointIndex) => <li key={point.title}><span aria-hidden="true">0{pointIndex + 1}</span><div><h4>{point.title}</h4><p>{point.text}</p></div></li>)}</ul>
      </div>)}
    </div>

    <div className="netsuite-process" aria-labelledby={`${uid}-process-title`}>
      <div className="netsuite-page__section-heading"><span className="netsuite-page__kicker">SUPPORT, WITH A METHOD</span><h2 id={`${uid}-process-title`}>Less guesswork.<br /><span>More understanding.</span></h2></div>
      <ol>{supportProcess.map((step, index) => <li key={step.title} data-crosshair-target><span className="netsuite-process__number" aria-hidden="true">0{index + 1}</span><h3>{step.title}</h3><p>{step.detail}</p></li>)}</ol>
    </div>

    <div className="netsuite-connect"><div><span className="netsuite-page__kicker">LET’S CONNECT THE DOTS</span><h2>A question. A process.<br /><em>A place to start.</em></h2><p>For NetSuite support, technical work, or a conversation about how I could help your team.</p></div><div className="netsuite-connect__actions"><a className="netsuite-page__button" href="#contact"><span>Start a conversation</span><ArrowIcon /></a><a className="netsuite-page__text-link" href="#projects">Explore my projects<ArrowIcon /></a></div></div>
  </section>;
}
// END OF FILE: NETSUITE-CROSSHAIR-R1 | NetSuite.jsx
