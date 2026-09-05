import { useState } from 'react';
import BlueTemplate from './components/quiz/templates/BlueTemplate.jsx';
import BlueYesNoTemplate from './components/quiz/templates/BlueYesNoTemplate.jsx';
import BlueIconGifTemplate from './components/quiz/templates/BlueIconGifTemplate.jsx';
import GreenTemplate from './components/quiz/templates/GreenTemplate.jsx';
import GreenYesNoTemplate from './components/quiz/templates/GreenYesNoTemplate.jsx';
import GreenIconGifTemplate from './components/quiz/templates/GreenIconGifTemplate.jsx';
import MaroonTemplate from './components/quiz/templates/MaroonTemplate.jsx';
import MaroonYesNoTemplate from './components/quiz/templates/MaroonYesNoTemplate.jsx';
import MaroonIconGifTemplate from './components/quiz/templates/MaroonIconGifTemplate.jsx';

/**
 * Template preview — every template rendered on one page, stacked:
 * blue, green, then maroon — three variants each.
 */

const Q1 = {
  stepNumber: '01',
  label: 'To get the clarity',
  question: (
    <>
      Before we get into the <span className="q-script">G</span>ood stuff,
      who&apos;s on the other side of this screen?
    </>
  ),
  options: [
    { id: 'founder', label: 'Founder or Managing Partner' },
    { id: 'head-marketing', label: 'Head of Marketing, Content, or Sale' },
    { id: 'performance-marketer', label: 'Performance Marketer' },
    { id: 'assistant', label: 'Marketing Assistant or Executive' },
    { id: 'freelancer', label: 'Freelancer' },
  ],
};

const Q2B = {
  stepNumber: '02',
  label: 'A quick gate check',
  question: (
    <>
      Do you have the operational ability to scale past $100k/month?
    </>
  ),
  options: [
    { id: 'yes', label: 'Yes', icon: 'tick' },
    { id: 'no', label: 'No', icon: 'cross' },
  ],
};

const Q4 = {
  stepNumber: '04',
  label: 'How you sell',
  question: (
    <>
      How does your business typically win a customer?
    </>
  ),
  options: [
    {
      id: 'slg',
      label: 'We close most deals through calls or demos',
      media: '/assets/nomads-icon.png',
    },
    {
      id: 'plg',
      label: 'Most people buy without ever talking to us',
      media: '/assets/nomads-icon.png',
    },
    {
      id: 'hybrid-call',
      label: 'Some buy on their own, some still need a call',
      media: '/assets/nomads-icon.png',
    },
    {
      id: 'hybrid-mess',
      label: "It's a bit all over the place right now",
      media: '/assets/nomads-icon.png',
    },
  ],
};

const LABEL_STYLE = {
  padding: '14px 24px',
  background: '#152638',
  color: '#e4fbff',
  fontFamily: 'monospace',
  fontSize: 13,
  letterSpacing: 1,
};

function SectionLabel({ children }) {
  return <div style={LABEL_STYLE}>{children}</div>;
}

export default function TemplatePreview() {
  const [listSel, setListSel] = useState(null);
  const [binSel, setBinSel] = useState(null);
  const [mediaSel, setMediaSel] = useState(null);
  const [gListSel, setGListSel] = useState(null);
  const [gBinSel, setGBinSel] = useState(null);
  const [gMediaSel, setGMediaSel] = useState(null);
  const [mListSel, setMListSel] = useState(null);
  const [mBinSel, setMBinSel] = useState(null);
  const [mMediaSel, setMMediaSel] = useState(null);

  return (
    <>
      <SectionLabel>1 · LIST TEMPLATE — BlueTemplate (Q1)</SectionLabel>
      <BlueTemplate
        {...Q1}
        selectedId={listSel}
        onSelect={setListSel}
        onBack={() => {}}
        progressPercent={0}
      />

      <SectionLabel>2 · YES/NO TEMPLATE — BlueYesNoTemplate (Q2B)</SectionLabel>
      <BlueYesNoTemplate
        {...Q2B}
        selectedId={binSel}
        onSelect={setBinSel}
        onBack={() => {}}
        progressPercent={5}
      />

      <SectionLabel>
        3 · ICON/GIF TEMPLATE — BlueIconGifTemplate (Q4)
      </SectionLabel>
      <BlueIconGifTemplate
        {...Q4}
        selectedId={mediaSel}
        onSelect={setMediaSel}
        onBack={() => {}}
        progressPercent={20}
      />

      <SectionLabel>4 · LIST TEMPLATE — GreenTemplate (Q1)</SectionLabel>
      <GreenTemplate
        {...Q1}
        selectedId={gListSel}
        onSelect={setGListSel}
        onBack={() => {}}
        progressPercent={0}
      />

      <SectionLabel>
        5 · YES/NO TEMPLATE — GreenYesNoTemplate (Q2B)
      </SectionLabel>
      <GreenYesNoTemplate
        {...Q2B}
        selectedId={gBinSel}
        onSelect={setGBinSel}
        onBack={() => {}}
        progressPercent={5}
      />

      <SectionLabel>
        6 · ICON/GIF TEMPLATE — GreenIconGifTemplate (Q4)
      </SectionLabel>
      <GreenIconGifTemplate
        {...Q4}
        selectedId={gMediaSel}
        onSelect={setGMediaSel}
        onBack={() => {}}
        progressPercent={20}
      />

      <SectionLabel>7 · LIST TEMPLATE — MaroonTemplate (Q1)</SectionLabel>
      <MaroonTemplate
        {...Q1}
        selectedId={mListSel}
        onSelect={setMListSel}
        onBack={() => {}}
        progressPercent={0}
      />

      <SectionLabel>
        8 · YES/NO TEMPLATE — MaroonYesNoTemplate (Q2B)
      </SectionLabel>
      <MaroonYesNoTemplate
        {...Q2B}
        selectedId={mBinSel}
        onSelect={setMBinSel}
        onBack={() => {}}
        progressPercent={5}
      />

      <SectionLabel>
        9 · ICON/GIF TEMPLATE — MaroonIconGifTemplate (Q4)
      </SectionLabel>
      <MaroonIconGifTemplate
        {...Q4}
        selectedId={mMediaSel}
        onSelect={setMMediaSel}
        onBack={() => {}}
        progressPercent={20}
      />
    </>
  );
}
