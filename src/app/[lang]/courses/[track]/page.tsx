import { prisma } from '@/lib/prisma';
import DemoFormClient from '@/components/DemoFormClient';
import Link from 'next/link';
import { ArrowLeft, BookOpen, CheckCircle, Clock, Users, ChevronDown, MessageCircle, Star, Target, Calendar, FileText, HelpCircle } from 'lucide-react';
import type { Metadata } from 'next';

interface Props { params: { lang: string; track: string } }

// Normalize track slug to DB targetTrack
function slugToTrack(slug: string): string {
  const map: Record<string, string> = {
    'foundation-6-to-9': 'FOUNDATION_6_9',
    'foundation_6_9': 'FOUNDATION_6_9',
    '10th-board': 'BOARD_10',
    'board_10': 'BOARD_10',
    '11-12-science': 'SCIENCE_11_12',
    'science_11_12': 'SCIENCE_11_12',
    'jee-neet': 'COMPETITIVE',
    'jee-neet-mht-cet-nata': 'COMPETITIVE',
    'competitive': 'COMPETITIVE',
    'mht-cet': 'COMPETITIVE_MHTCET',
    'competitive_mhtcet': 'COMPETITIVE_MHTCET',
    'nata': 'COMPETITIVE_NATA',
    'competitive_nata': 'COMPETITIVE_NATA',

  };
  return map[slug] || slug.toUpperCase().replace(/-/g, '_');
}

const PRIORITY_STYLES: Record<string, string> = {
  High: 'bg-red-500/15 text-red-400 border-red-500/30',
  Medium: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  Low: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
};

const TRACK_ACCENT: Record<string, { color: string; border: string; icon: string }> = {
  FOUNDATION_6_9: { color: 'text-purple-400', border: 'border-purple-500/40', icon: '📚' },
  BOARD_10: { color: 'text-blue-400', border: 'border-blue-500/40', icon: '🎯' },
  SCIENCE_11_12: { color: 'text-brand-green', border: 'border-brand-green/40', icon: '🔬' },
  COMPETITIVE: { color: 'text-brand-amber', border: 'border-brand-amber/40', icon: '🏆' },
  COMPETITIVE_MHTCET: { color: 'text-teal-400', border: 'border-teal-500/40', icon: '⚡' },
  COMPETITIVE_NATA: { color: 'text-red-400', border: 'border-red-500/40', icon: '📐' },
};

const STATIC_COURSES_FALLBACKS: Record<string, any> = {
  FOUNDATION_6_9: {
    title: 'Foundation Program', subtitle: 'Class 6th to 8th',
    description: 'A strong academic foundation for students from Class 6 to 8. We focus on building conceptual clarity in Mathematics and Science to prepare students for the rigours of 9th and 10th Board.',
    subjects: 'Mathematics, Science', targetTrack: 'FOUNDATION_6_9', targetClass: '6th to 8th', duration: '1 Academic Year',
    whoShouldJoin: 'Students from Class 6th to 8th who want to build a strong conceptual base. Especially recommended for students who feel weak in Maths or Science.',
    teachingMethodology: 'Concept-first teaching with real-world examples. Each topic is introduced visually and then practised through worksheets.',
    weeklyTestPlan: 'Every Saturday: Chapter-wise objective test (20 MCQs, 30 minutes).',
    doubtSolvingSystem: 'Dedicated doubt-solving session after every class (15–20 minutes).',
    examPattern: 'Aligned with Maharashtra SSC Board patterns. Tests include MCQs, short answers, and diagram-based questions.',
    syllabus: [{
      id: 'syl-found', boardExam: 'Maharashtra SSC Board (Std 6–8)', academicYear: '2024-25', sourceNote: 'Based on Maharashtra State Board (MSBSHSE) Balbharati curriculum guidelines for Standards 6, 7 and 8.',
      subjects: [
        { id: 'sub-f-math', name: 'Mathematics', chapters: [
          { id: 'ch-f-m1', name: 'Natural Numbers and Integers', topics: 'Basic operations, number line, properties', priority: 'High', examRelevance: 'Board', isImportant: true },
          { id: 'ch-f-m2', name: 'Fractions and Decimals', topics: 'Types, arithmetic operations, conversion', priority: 'High', examRelevance: 'Board', isImportant: true },
          { id: 'ch-f-m3', name: 'HCF and LCM', topics: 'Prime factorization, divisibility rules', priority: 'High', examRelevance: 'Board', isImportant: true },
          { id: 'ch-f-m4', name: 'Ratio and Proportion', topics: 'Direct & inverse variation, unitary method', priority: 'Medium', examRelevance: 'Board', isImportant: false },
          { id: 'ch-f-m5', name: 'Equations in One Variable', topics: 'Formulating and solving linear equations', priority: 'High', examRelevance: 'Board', isImportant: true },
          { id: 'ch-f-m6', name: 'Practical Geometry', topics: 'Constructing angles, parallel lines, triangles', priority: 'Medium', examRelevance: 'Board', isImportant: false },
          { id: 'ch-f-m7', name: 'Mensuration', topics: 'Perimeter and area of standard 2D shapes', priority: 'High', examRelevance: 'Board', isImportant: true }
        ]},
        { id: 'sub-f-sci', name: 'Science', chapters: [
          { id: 'ch-f-s1', name: 'Natural Resources', topics: 'Air, Water and Land characteristics and conservation', priority: 'Medium', examRelevance: 'Board', isImportant: false },
          { id: 'ch-f-s2', name: 'Living World and Plant Structure', topics: 'Classification, parts of plants and functions', priority: 'High', examRelevance: 'Board', isImportant: true },
          { id: 'ch-f-s3', name: 'Force, Work and Energy', topics: 'Types of forces, relationship between force, work, energy', priority: 'High', examRelevance: 'Board', isImportant: true },
          { id: 'ch-f-s4', name: 'Heat and Temperature', topics: 'Conduction, convection, radiation, thermometer', priority: 'High', examRelevance: 'Board', isImportant: true },
          { id: 'ch-f-s5', name: 'Food, Nutrition and Diet', topics: 'Nutrients, deficiency diseases, balanced diet', priority: 'Medium', examRelevance: 'Board', isImportant: false },
          { id: 'ch-f-s6', name: 'Light, Sound and Shadow', topics: 'Reflection, transmission, propagation properties', priority: 'High', examRelevance: 'Board', isImportant: true }
        ]}
      ]
    }],
    faqs: []
  },
  BOARD_10: {
    title: '9th-10th Board Mastery', subtitle: 'SSC Board',
    description: 'Targeted preparation for Maharashtra Board exams. Covers Mathematics and Science in depth with chapter-wise tests and full-length mock tests.',
    subjects: 'Mathematics, Science', targetTrack: 'BOARD_10', targetClass: '9th & 10th Standard', duration: '1 Academic Year',
    whoShouldJoin: 'Students appearing for their 9th/10th standard board exams who want to score top marks and build strong foundations.',
    teachingMethodology: 'Board-exam-oriented teaching. Every concept is explained with exam-style presentation. Special focus on diagram drawing and proof writing.',
    weeklyTestPlan: 'Weekly chapter-wise tests. Monthly full-syllabus prelim in exact Board format.',
    doubtSolvingSystem: 'Doubt-solving after every class. Dedicated WhatsApp doubt support.',
    examPattern: 'Board exam patterns: Theory + Internal Assessments. MCQs, short answers, long answers, and diagram-based questions.',
    syllabus: [{
      id: 'syl-b10', boardExam: 'Maharashtra SSC Board 9th-10th', academicYear: '2024-25', sourceNote: 'Based on MSBSHSE official curriculum for Standards 9 & 10 (SSC).',
      subjects: [
        { id: 'sub-b10-math', name: 'Mathematics', chapters: [
          { id: 'ch-b10-m1', name: 'Linear Equations in Two Variables', topics: 'Graphical method, Cramer\'s rule, word problems', priority: 'High', examRelevance: 'Board', isImportant: true },
          { id: 'ch-b10-m2', name: 'Quadratic Equations', topics: 'Factorization, formula method, nature of roots', priority: 'High', examRelevance: 'Board', isImportant: true },
          { id: 'ch-b10-m3', name: 'Arithmetic Progression', topics: 'Common difference, nth term, sum of n terms', priority: 'High', examRelevance: 'Board', isImportant: true },
          { id: 'ch-b10-m4', name: 'Similarity and Pythagoras Theorem', topics: 'BPT, geometric mean, applications', priority: 'High', examRelevance: 'Board', isImportant: true },
          { id: 'ch-b10-m5', name: 'Circle and Tangents', topics: 'Inscribed angle, cyclic quadrilaterals, tangent-secant', priority: 'High', examRelevance: 'Board', isImportant: true },
          { id: 'ch-b10-m6', name: 'Trigonometry', topics: 'Trigonometric ratios, identities, heights and distances', priority: 'High', examRelevance: 'Board', isImportant: true },
          { id: 'ch-b10-m7', name: 'Co-ordinate Geometry', topics: 'Distance formula, section formula, slope', priority: 'Medium', examRelevance: 'Board', isImportant: false },
          { id: 'ch-b10-m8', name: 'Mensuration', topics: 'Surface area and volume of cylinder, cone, sphere, frustum', priority: 'High', examRelevance: 'Board', isImportant: true }
        ]},
        { id: 'sub-b10-sci', name: 'Science', chapters: [
          { id: 'ch-b10-s1', name: 'Laws of Motion and Gravitation', topics: 'Velocity, acceleration, Kepler\'s laws', priority: 'High', examRelevance: 'Board', isImportant: true },
          { id: 'ch-b10-s2', name: 'Chemical Reactions, Acids and Bases', topics: 'Balancing equations, pH scale, salts', priority: 'High', examRelevance: 'Board', isImportant: true },
          { id: 'ch-b10-s3', name: 'Classification of Elements & Carbon Compounds', topics: 'Periodic table, organic compounds', priority: 'High', examRelevance: 'Board', isImportant: true },
          { id: 'ch-b10-s4', name: 'Refraction and Dispersion of Light', topics: 'Lenses, defects of vision, prism refraction', priority: 'High', examRelevance: 'Board', isImportant: true },
          { id: 'ch-b10-s5', name: 'Electricity and Electromagnetism', topics: 'Ohm\'s law, heating effects, electromagnetic induction', priority: 'High', examRelevance: 'Board', isImportant: true },
          { id: 'ch-b10-s6', name: 'Life Processes & Heredity', topics: 'Transcription, translation, Darwin, cell division', priority: 'High', examRelevance: 'Board', isImportant: true },
          { id: 'ch-b10-s7', name: 'Environmental Management', topics: 'Ecosystems, waste management, GMOs', priority: 'Low', examRelevance: 'Board', isImportant: false }
        ]}
      ]
    }],
    faqs: []
  },
  SCIENCE_11_12: {
    title: '11th–12th Science', subtitle: 'HSC Board + Entrance Ready',
    description: 'Comprehensive coaching for 11th and 12th Science. Dual-track preparation — Board exams and competitive entrance exams.',
    subjects: 'Physics, Chemistry, Maths, Biology', targetTrack: 'SCIENCE_11_12', targetClass: '11th & 12th Standard', duration: '2 Academic Years',
    whoShouldJoin: 'Students joining 11th Science wanting to prepare for HSC Board exams along with competitive entrance exams.',
    teachingMethodology: 'Parallel Board + entrance preparation. HSC concepts taught first to build foundation, then extended to application level.',
    weeklyTestPlan: 'Weekly chapter-wise objective tests. Bi-weekly Board-format long-answer tests.',
    doubtSolvingSystem: 'Subject-wise doubt sessions. WhatsApp support. Peer study groups.',
    examPattern: 'Dual pattern: MSBSHSE HSC Board theory/practicals, plus JEE/NEET patterns.',
    syllabus: [{
      id: 'syl-sci', boardExam: 'Maharashtra HSC Board', academicYear: '2024-25', sourceNote: 'Based on MSBSHSE HSC Board syllabus for Standards 11 & 12 Science.',
      subjects: [
        { id: 'sub-sci-phy', name: 'Physics', chapters: [
          { id: 'ch-sp1', name: 'Rotational Dynamics', topics: 'Moment of inertia, angular momentum, torque', priority: 'High', examRelevance: 'Board,JEE', isImportant: true },
          { id: 'ch-sp2', name: 'Mechanical Properties of Fluids', topics: 'Surface tension, viscosity, Bernoulli\'s theorem', priority: 'High', examRelevance: 'Board', isImportant: true },
          { id: 'ch-sp3', name: 'Kinetic Theory of Gases & Radiation', topics: 'Black body, Stefan\'s law, gas laws', priority: 'High', examRelevance: 'Board,JEE', isImportant: true },
          { id: 'ch-sp4', name: 'Thermodynamics', topics: 'Laws of thermodynamics, Carnot cycle', priority: 'High', examRelevance: 'Board,JEE,NEET', isImportant: true },
          { id: 'ch-sp5', name: 'Oscillations and Wave Optics', topics: 'SHM, superposition, interference, diffraction', priority: 'High', examRelevance: 'Board,JEE,NEET', isImportant: true },
          { id: 'ch-sp6', name: 'Electrostatics & Current Electricity', topics: 'Gauss\'s law, capacitors, Kirchhoff\'s laws', priority: 'High', examRelevance: 'Board,JEE,NEET', isImportant: true },
          { id: 'ch-sp7', name: 'Magnetic Fields and Induction', topics: 'Biot-Savart, Ampere\'s law, Faraday\'s law, AC', priority: 'High', examRelevance: 'Board,JEE,NEET', isImportant: true },
          { id: 'ch-sp8', name: 'Modern Physics', topics: 'Dual nature, Bohr model, nuclear decay, semiconductors', priority: 'High', examRelevance: 'Board,JEE,NEET', isImportant: true }
        ]},
        { id: 'sub-sci-chem', name: 'Chemistry', chapters: [
          { id: 'ch-sc1', name: 'Solid State and Solutions', topics: 'Crystal lattices, colligative properties, Raoult\'s law', priority: 'High', examRelevance: 'Board,JEE', isImportant: true },
          { id: 'ch-sc2', name: 'Ionic Equilibria & Thermodynamics', topics: 'pH, buffer solutions, enthalpy, entropy', priority: 'High', examRelevance: 'Board,JEE,NEET', isImportant: true },
          { id: 'ch-sc3', name: 'Electrochemistry & Chemical Kinetics', topics: 'Nernst equation, rate laws, Arrhenius equation', priority: 'High', examRelevance: 'Board,JEE,NEET', isImportant: true },
          { id: 'ch-sc4', name: 'Coordination & Transition Elements', topics: 'd and f block, ligands, isomerism', priority: 'High', examRelevance: 'Board,JEE', isImportant: true },
          { id: 'ch-sc5', name: 'Halogen Derivatives & Alcohols', topics: 'Substitution, elimination, reactions', priority: 'High', examRelevance: 'Board,JEE,NEET', isImportant: true },
          { id: 'ch-sc6', name: 'Aldehydes, Ketones & Carboxylic Acids', topics: 'Named reactions, organic mechanism', priority: 'High', examRelevance: 'Board,JEE,NEET', isImportant: true },
          { id: 'ch-sc7', name: 'Amines and Biomolecules', topics: 'Basic strength, carbohydrates, proteins', priority: 'Medium', examRelevance: 'Board', isImportant: false }
        ]},
        { id: 'sub-sci-math', name: 'Mathematics', chapters: [
          { id: 'ch-sm1', name: 'Mathematical Logic and Matrices', topics: 'Truth tables, inverse, system of equations', priority: 'High', examRelevance: 'Board,JEE', isImportant: true },
          { id: 'ch-sm2', name: 'Trigonometric Functions', topics: 'Principal/general solutions, properties of triangles', priority: 'High', examRelevance: 'Board,JEE', isImportant: true },
          { id: 'ch-sm3', name: 'Line and Plane in 3D', topics: 'Vector/Cartesian equations, shortest distance', priority: 'High', examRelevance: 'Board,JEE', isImportant: true },
          { id: 'ch-sm4', name: 'Differentiation and Applications', topics: 'Chain rule, derivatives, tangents, maxima/minima', priority: 'High', examRelevance: 'Board,JEE', isImportant: true },
          { id: 'ch-sm5', name: 'Integration and Definite Integrals', topics: 'Substitution, parts, area under curve', priority: 'High', examRelevance: 'Board,JEE', isImportant: true },
          { id: 'ch-sm6', name: 'Differential Equations', topics: 'Order/degree, variable separable', priority: 'High', examRelevance: 'Board,JEE', isImportant: true },
          { id: 'ch-sm7', name: 'Probability & Binomial Distribution', topics: 'PMF, CDF, expected value', priority: 'Medium', examRelevance: 'Board', isImportant: false }
        ]},
        { id: 'sub-sci-bio', name: 'Biology', chapters: [
          { id: 'ch-sb1', name: 'Reproduction in Plants and Animals', topics: 'Asexual/sexual, fertilization, human reproduction', priority: 'High', examRelevance: 'Board,NEET', isImportant: true },
          { id: 'ch-sb2', name: 'Inheritance and Variation', topics: 'Mendelian inheritance, linkage, disorders', priority: 'High', examRelevance: 'Board,NEET', isImportant: true },
          { id: 'ch-sb3', name: 'Molecular Basis of Inheritance', topics: 'DNA replication, transcription, genetic code', priority: 'High', examRelevance: 'Board,NEET', isImportant: true },
          { id: 'ch-sb4', name: 'Plant Water Relations & Growth', topics: 'Osmosis, transpiration, plant hormones', priority: 'High', examRelevance: 'Board,NEET', isImportant: true },
          { id: 'ch-sb5', name: 'Respiration and Circulation', topics: 'Respiratory organs, heart structure', priority: 'High', examRelevance: 'Board,NEET', isImportant: true },
          { id: 'ch-sb6', name: 'Control and Co-ordination', topics: 'Nervous system, endocrine glands', priority: 'High', examRelevance: 'Board,NEET', isImportant: true },
          { id: 'ch-sb7', name: 'Biotechnology', topics: 'Recombinant DNA, PCR, applications', priority: 'Medium', examRelevance: 'Board,NEET', isImportant: false }
        ]}
      ]
    }],
    faqs: []
  },
  COMPETITIVE: {
    title: 'JEE & NEET', subtitle: 'Competitive Focus',
    description: 'Focused preparation for JEE Main and NEET UG. Covers complete syllabus as per official NTA and NCERT guidelines.',
    subjects: 'Physics, Chemistry, Maths, Biology', targetTrack: 'COMPETITIVE', targetClass: '11th, 12th & Droppers', duration: '1 Academic Year',
    whoShouldJoin: 'Students preparing for top-tier engineering (JEE) or medical (NEET) entrance exams.',
    teachingMethodology: 'Exam-strategy-first approach. Topics covered in priority order. Special sessions on time management and elimination techniques.',
    weeklyTestPlan: 'Daily practice sets. Weekly chapter-wise mocks. Bi-weekly full-length mock exams.',
    doubtSolvingSystem: 'Daily doubt-solving at the end of each session. Dedicated WhatsApp group support.',
    examPattern: 'Official NTA patterns: JEE Main CBT format, NEET UG 180 MCQs.',
    syllabus: [{
      id: 'syl-jee', boardExam: 'JEE Main & NEET UG', academicYear: '2024-25', sourceNote: 'Based on National Testing Agency (NTA) official syllabus and NCERT textbook guidelines for JEE Main & NEET UG.',
      subjects: [
        { id: 'sub-j-phy', name: 'Physics', chapters: [
          { id: 'ch-jp1', name: 'Mechanics and Kinematics', topics: 'Newton\'s laws, projectile motion, friction, work-energy-power', priority: 'High', examRelevance: 'JEE,NEET', isImportant: true },
          { id: 'ch-jp2', name: 'Rotational Dynamics', topics: 'Torque, angular momentum, conservation, rolling', priority: 'High', examRelevance: 'JEE,NEET', isImportant: true },
          { id: 'ch-jp3', name: 'Gravitation & Properties of Matter', topics: 'Kepler\'s laws, elasticity, viscosity', priority: 'High', examRelevance: 'JEE,NEET', isImportant: true },
          { id: 'ch-jp4', name: 'Thermodynamics & Kinetic Theory', topics: 'Ideal gas behavior, Carnot engine', priority: 'High', examRelevance: 'JEE,NEET', isImportant: true },
          { id: 'ch-jp5', name: 'Electrostatics & Magnetism', topics: 'Gauss\'s theorem, capacitance, Biot-Savart, Ampere\'s law', priority: 'High', examRelevance: 'JEE,NEET', isImportant: true },
          { id: 'ch-jp6', name: 'Electromagnetic Induction & AC', topics: 'Faraday\'s laws, self/mutual induction, LCR circuits', priority: 'High', examRelevance: 'JEE,NEET', isImportant: true },
          { id: 'ch-jp7', name: 'Optics', topics: 'Lenses, wave optics, interference, diffraction', priority: 'High', examRelevance: 'JEE,NEET', isImportant: true },
          { id: 'ch-jp8', name: 'Modern Physics', topics: 'Photoelectric effect, Bohr\'s model, radioactivity, logic gates', priority: 'High', examRelevance: 'JEE,NEET', isImportant: true }
        ]},
        { id: 'sub-j-chem', name: 'Chemistry', chapters: [
          { id: 'ch-jc1', name: 'Atomic Structure & Bonding', topics: 'Quantum numbers, hybridization, VSEPR', priority: 'High', examRelevance: 'JEE,NEET', isImportant: true },
          { id: 'ch-jc2', name: 'Thermodynamics & Equilibrium', topics: 'Chemical & ionic equilibrium, buffer solutions', priority: 'High', examRelevance: 'JEE,NEET', isImportant: true },
          { id: 'ch-jc3', name: 'Electrochemistry & Chemical Kinetics', topics: 'Galvanic cells, activation energy, order', priority: 'High', examRelevance: 'JEE,NEET', isImportant: true },
          { id: 'ch-jc4', name: 'Coordination & p/d/f Block', topics: 'IUPAC nomenclature, crystal field theory', priority: 'High', examRelevance: 'JEE,NEET', isImportant: true },
          { id: 'ch-jc5', name: 'General Organic Chemistry', topics: 'Inductive/resonance effects, stability', priority: 'High', examRelevance: 'JEE,NEET', isImportant: true },
          { id: 'ch-jc6', name: 'Organic Reaction Mechanisms', topics: 'Aldol, Cannizzaro, Grignard, Friedel-Crafts', priority: 'High', examRelevance: 'JEE,NEET', isImportant: true },
          { id: 'ch-jc7', name: 'Biomolecules & Polymers', topics: 'Amino acids, nucleic acids, addition polymers', priority: 'Medium', examRelevance: 'JEE,NEET', isImportant: false }
        ]},
        { id: 'sub-j-math', name: 'Mathematics (JEE)', chapters: [
          { id: 'ch-jm1', name: 'Complex Numbers & Quadratics', topics: 'Roots, Argand plane, inequalities', priority: 'High', examRelevance: 'JEE', isImportant: true },
          { id: 'ch-jm2', name: 'Sequences, Series & Binomial Theorem', topics: 'AP, GP, HP, binomial expansions', priority: 'High', examRelevance: 'JEE', isImportant: true },
          { id: 'ch-jm3', name: 'Matrices and Determinants', topics: 'Adjoint, inverse, properties of determinants', priority: 'High', examRelevance: 'JEE', isImportant: true },
          { id: 'ch-jm4', name: 'Coordinate Geometry (Conics)', topics: 'Parabola, ellipse, hyperbola, tangents', priority: 'High', examRelevance: 'JEE', isImportant: true },
          { id: 'ch-jm5', name: 'Calculus - Limits & Differentiation', topics: 'L\'Hopital rule, mean value theorems', priority: 'High', examRelevance: 'JEE', isImportant: true },
          { id: 'ch-jm6', name: 'Integral Calculus & Area', topics: 'Indefinite/definite integrals, area under curve', priority: 'High', examRelevance: 'JEE', isImportant: true },
          { id: 'ch-jm7', name: 'Vectors and 3D Geometry', topics: 'Dot/cross products, lines and planes', priority: 'High', examRelevance: 'JEE', isImportant: true }
        ]},
        { id: 'sub-j-bio', name: 'Biology (NEET)', chapters: [
          { id: 'ch-jb1', name: 'Cell Biology and Cell Cycle', topics: 'Organelles, mitosis, meiosis', priority: 'High', examRelevance: 'NEET', isImportant: true },
          { id: 'ch-jb2', name: 'Genetics and Molecular Biology', topics: 'Mendelism, DNA structure, protein synthesis', priority: 'High', examRelevance: 'NEET', isImportant: true },
          { id: 'ch-jb3', name: 'Human Physiology', topics: 'Digestive, circulatory, nervous, endocrine', priority: 'High', examRelevance: 'NEET', isImportant: true },
          { id: 'ch-jb4', name: 'Plant Anatomy & Physiology', topics: 'Photosynthesis, cellular respiration', priority: 'High', examRelevance: 'NEET', isImportant: true },
          { id: 'ch-jb5', name: 'Ecology and Environment', topics: 'Ecosystems, population, biodiversity', priority: 'Medium', examRelevance: 'NEET', isImportant: false },
          { id: 'ch-jb6', name: 'Biotechnology and Applications', topics: 'Recombinant DNA technology, PCR, GMOs', priority: 'High', examRelevance: 'NEET', isImportant: true }
        ]}
      ]
    }],
    faqs: []
  },
  COMPETITIVE_MHTCET: {
    title: 'MHT-CET (PCMB Group)', subtitle: 'State Level Engineering & Pharmacy',
    description: 'Rigorous coaching tailored to the Maharashtra State Board syllabus for MHT-CET. Complete focus on speed, accuracy, and practice of past MHT-CET questions.',
    subjects: 'Physics, Chemistry, Maths, Biology', targetTrack: 'COMPETITIVE_MHTCET', targetClass: '11th, 12th & Droppers', duration: '1 Academic Year',
    whoShouldJoin: 'Students preparing for engineering (BE/BTech) or pharmacy (BPharm) admissions in Maharashtra colleges through MHT-CET.',
    teachingMethodology: 'Speed and accuracy focused approach. Solving previous year CET questions and learning shortcuts for time management.',
    weeklyTestPlan: 'Topic-wise CET mock tests every week. Full-length 150/200 mark mocks in the final 3 months.',
    doubtSolvingSystem: 'Doubt resolution sessions focused on quick solving techniques and MCQ shortcuts.',
    examPattern: 'MHT-CET Pattern: 150/200 MCQs in 3 hours with no negative marking. PCMB combinations.',
    syllabus: [{
      id: 'syl-cet', boardExam: 'MHT-CET 2024-25', academicYear: '2024-25', sourceNote: 'Based on State Common Entrance Test Cell, Maharashtra State official syllabus (aligned with MSBSHSE 11th and 12th standard textbooks).',
      subjects: [
        { id: 'sub-c-phy', name: 'Physics', chapters: [
          { id: 'ch-cp1', name: 'Kinematics and Laws of Motion', topics: 'Projectiles, circular motion, friction', priority: 'High', examRelevance: 'MHT-CET', isImportant: true },
          { id: 'ch-cp2', name: 'Rotational Dynamics and Gravitation', topics: 'Kepler\'s laws, moment of inertia', priority: 'High', examRelevance: 'MHT-CET', isImportant: true },
          { id: 'ch-cp3', name: 'Thermal Properties & Thermodynamics', topics: 'Heat, specific heat, first/second law', priority: 'High', examRelevance: 'MHT-CET', isImportant: true },
          { id: 'ch-cp4', name: 'Electrostatics & Current Electricity', topics: 'Gauss law, capacitors, Wheatstone bridge', priority: 'High', examRelevance: 'MHT-CET', isImportant: true },
          { id: 'ch-cp5', name: 'Electromagnetic Induction & AC Circuits', topics: 'Faraday\'s law, reactance, impedance', priority: 'High', examRelevance: 'MHT-CET', isImportant: true },
          { id: 'ch-cp6', name: 'Wave Optics & Interference', topics: 'Superposition, Young\'s double slit', priority: 'High', examRelevance: 'MHT-CET', isImportant: true },
          { id: 'ch-cp7', name: 'Atoms, Molecules & Nuclei', topics: 'Bohr\'s model, radioactive decay law', priority: 'Medium', examRelevance: 'MHT-CET', isImportant: false }
        ]},
        { id: 'sub-c-chem', name: 'Chemistry', chapters: [
          { id: 'ch-cc1', name: 'Chemical Thermodynamics', topics: 'State functions, enthalpy, entropy', priority: 'High', examRelevance: 'MHT-CET', isImportant: true },
          { id: 'ch-cc2', name: 'Solutions and Colligative Properties', topics: 'Henry\'s law, vapor pressure lowering', priority: 'High', examRelevance: 'MHT-CET', isImportant: true },
          { id: 'ch-cc3', name: 'Chemical Kinetics & Electrochemistry', topics: 'Order/molecularity, Nernst equation', priority: 'High', examRelevance: 'MHT-CET', isImportant: true },
          { id: 'ch-cc4', name: 'Coordination Compounds & Metallurgy', topics: 'Ligands, IUPAC name, extraction', priority: 'Medium', examRelevance: 'MHT-CET', isImportant: false },
          { id: 'ch-cc5', name: 'Halogen Derivatives and Alcohols', topics: 'SN1/SN2, dehydration of alcohols', priority: 'High', examRelevance: 'MHT-CET', isImportant: true },
          { id: 'ch-cc6', name: 'Aldehydes, Ketones & Carboxylic Acids', topics: 'Nucleophilic addition, oxidation', priority: 'High', examRelevance: 'MHT-CET', isImportant: true },
          { id: 'ch-cc7', name: 'Polymers & Green Chemistry', topics: 'Natural & synthetic rubbers, nylon', priority: 'Medium', examRelevance: 'MHT-CET', isImportant: false }
        ]},
        { id: 'sub-c-math', name: 'Mathematics', chapters: [
          { id: 'ch-cm1', name: 'Mathematical Logic & Matrices', topics: 'Statements, truth values, adjoint', priority: 'High', examRelevance: 'MHT-CET', isImportant: true },
          { id: 'ch-cm2', name: 'Trigonometric Functions', topics: 'Principal & general solutions, polar', priority: 'High', examRelevance: 'MHT-CET', isImportant: true },
          { id: 'ch-cm3', name: 'Straight Lines, Circles & Vectors', topics: 'Dot and cross products', priority: 'High', examRelevance: 'MHT-CET', isImportant: true },
          { id: 'ch-cm4', name: 'Three Dimensional Geometry', topics: 'Direction angles, line & plane equations', priority: 'High', examRelevance: 'MHT-CET', isImportant: true },
          { id: 'ch-cm5', name: 'Differentiation & Integration', topics: 'Chain rule, definite integral properties', priority: 'High', examRelevance: 'MHT-CET', isImportant: true },
          { id: 'ch-cm6', name: 'Differential Equations', topics: 'Order, degree, variable separable', priority: 'High', examRelevance: 'MHT-CET', isImportant: true },
          { id: 'ch-cm7', name: 'Probability Distribution', topics: 'Bernoulli trials, binomial distribution', priority: 'Medium', examRelevance: 'MHT-CET', isImportant: false }
        ]},
        { id: 'sub-c-bio', name: 'Biology', chapters: [
          { id: 'ch-cb1', name: 'Genetic Basis of Inheritance', topics: 'Mendel\'s laws, monohybrid, dihybrid', priority: 'High', examRelevance: 'MHT-CET', isImportant: true },
          { id: 'ch-cb2', name: 'Gene: Nature, Expression & Regulation', topics: 'DNA packaging, replication', priority: 'High', examRelevance: 'MHT-CET', isImportant: true },
          { id: 'ch-cb3', name: 'Respiration and Circulation', topics: 'Gaseous exchange, double circulation', priority: 'High', examRelevance: 'MHT-CET', isImportant: true },
          { id: 'ch-cb4', name: 'Control and Co-ordination', topics: 'Nervous system, reflex actions', priority: 'High', examRelevance: 'MHT-CET', isImportant: true },
          { id: 'ch-cb5', name: 'Organisms and Environment', topics: 'Population density, ecological successions', priority: 'Medium', examRelevance: 'MHT-CET', isImportant: false },
          { id: 'ch-cb6', name: 'Biotechnology', topics: 'Process of recombinant DNA, cloning vectors', priority: 'High', examRelevance: 'MHT-CET', isImportant: true }
        ]}
      ]
    }],
    faqs: []
  },
  COMPETITIVE_NATA: {
    title: 'NATA', subtitle: 'Architecture Entrance',
    description: 'Comprehensive preparation for National Aptitude Test in Architecture (NATA). Covers cognitive abilities, general aptitude, basic mathematics, physics, chemistry, and drawing.',
    subjects: 'Physics, Chemistry, Maths, Biology', targetTrack: 'COMPETITIVE_NATA', targetClass: '11th, 12th & Droppers', duration: '1 Academic Year',
    whoShouldJoin: 'Students aspiring for admission to B.Arch programs in premium architecture colleges across India through NATA.',
    teachingMethodology: 'Focus on visual, spatial, and cognitive skills alongside core science subjects. Drawing techniques and quick aptitude solving.',
    weeklyTestPlan: 'Aptitude and drawing mock tests. Full length NATA CBT mocks.',
    doubtSolvingSystem: 'Drawing critique sessions and personalized feedback on aptitude questions.',
    examPattern: 'NATA Pattern: Cognitive skills, visual reasoning, general knowledge, drawing, and basic science.',
    syllabus: [{
      id: 'syl-nata', boardExam: 'NATA 2024-25', academicYear: '2024-25', sourceNote: 'Based on Council of Architecture (CoA) official NATA guidelines and syllabus.',
      subjects: [
        { id: 'sub-n-phy', name: 'Physics', chapters: [
          { id: 'ch-np1', name: 'Mechanics and Kinematics', topics: 'Motion in 1D/2D, Newton\'s laws, gravity', priority: 'High', examRelevance: 'NATA', isImportant: true },
          { id: 'ch-np2', name: 'Optics and Wave Phenomena', topics: 'Reflection, refraction, lenses', priority: 'High', examRelevance: 'NATA', isImportant: true },
          { id: 'ch-np3', name: 'Electricity and Magnetism', topics: 'Electric current, circuits, magnets', priority: 'High', examRelevance: 'NATA', isImportant: true },
          { id: 'ch-np4', name: 'Heat and Thermodynamics', topics: 'Thermal expansion, heat transfer', priority: 'Medium', examRelevance: 'NATA', isImportant: false }
        ]},
        { id: 'sub-n-chem', name: 'Chemistry', chapters: [
          { id: 'ch-nc1', name: 'Basic Principles of Chemistry', topics: 'Elements, compounds, chemical reactions', priority: 'High', examRelevance: 'NATA', isImportant: true },
          { id: 'ch-nc2', name: 'Electrochemistry and Kinetics', topics: 'Cell reactions, corrosion', priority: 'Medium', examRelevance: 'NATA', isImportant: false },
          { id: 'ch-nc3', name: 'Polymers & Environmental Chemistry', topics: 'Plastics, rubbers, green building concepts', priority: 'High', examRelevance: 'NATA', isImportant: true }
        ]},
        { id: 'sub-n-math', name: 'Mathematics & Aptitude', chapters: [
          { id: 'ch-nm1', name: 'Architectural Aptitude', topics: 'Visualisation, 2D/3D sketching, elevation', priority: 'High', examRelevance: 'NATA', isImportant: true },
          { id: 'ch-nm2', name: 'Logical & Analytical Reasoning', topics: 'Series, patterns, non-verbal reasoning', priority: 'High', examRelevance: 'NATA', isImportant: true },
          { id: 'ch-nm3', name: 'Algebra and Coordinate Geometry', topics: 'Quadratic equations, straight lines', priority: 'High', examRelevance: 'NATA', isImportant: true },
          { id: 'ch-nm4', name: 'Mensuration and 3D Geometry', topics: 'Volume, surface area of pyramids, cones', priority: 'High', examRelevance: 'NATA', isImportant: true }
        ]},
        { id: 'sub-n-bio', name: 'Biology & Ecology', chapters: [
          { id: 'ch-nb1', name: 'Biomimicry & Biological Structures', topics: 'Inspiration from nature in architectural design', priority: 'High', examRelevance: 'NATA', isImportant: true },
          { id: 'ch-nb2', name: 'Ecology & Sustainable Environment', topics: 'Ecosystems, green cover, conservation', priority: 'High', examRelevance: 'NATA', isImportant: true }
        ]}
      ]
    }],
    faqs: []
  }
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { track } = params;
  const targetTrack = slugToTrack(track);
  try {
    const course = await prisma.course.findFirst({ where: { OR: [{ slug: track }, { targetTrack }] } });
    if (!course) return { title: 'Course | Trimitra Coaching Centre' };
    return {
      title: course.metaTitle || `${course.title} | Trimitra Coaching Centre, Talegaon Dighe`,
      description: course.metaDescription || course.description || `Expert coaching for ${course.title} in Talegaon Dighe near Sangamner. Small batches, personal attention, structured preparation.`,
      keywords: `${course.title} coaching near Sangamner, ${course.targetClass} tuition Talegaon Dighe, best coaching classes near Sangamner`,
      openGraph: {
        title: course.metaTitle || `${course.title} Coaching | Trimitra`,
        description: course.metaDescription || `Expert coaching for ${course.title}. Enroll now at Trimitra Coaching Centre.`,
      },
    };
  } catch (e) {
    console.error('Failed to generate metadata from DB:', e);
    return {
      title: 'Course | Trimitra Coaching Centre',
      description: 'Expert coaching for School Board and Competitive Exams in Talegaon Dighe near Sangamner.',
    };
  }
}

export default async function CourseDetailPage({ params }: Props) {
  const { lang, track } = params;
  const targetTrack = slugToTrack(track);

  let course: any = null;
  let globalFAQs: any[] = [];
  let settings: any = null;

  try {
    course = await prisma.course.findFirst({
      where: { OR: [{ slug: track }, { targetTrack }] },
      include: {
        syllabus: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            subjects: {
              orderBy: { sortOrder: 'asc' },
              include: { chapters: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } },
            },
          },
        },
        faqs: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
      },
    });
    globalFAQs = await prisma.fAQ.findMany({
      where: { isActive: true, courseId: null },
      orderBy: { sortOrder: 'asc' },
      take: 4,
    });
    settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
  } catch (e) {
    console.error('Failed to fetch course details from database, using static fallback:', e);
  }

  // Fallback to static mock data if course not found in database (e.g. database down/empty)
  if (!course) {
    course = STATIC_COURSES_FALLBACKS[targetTrack];
  }

  if (!course) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-400">Course not found.</p>
        <Link href={`/${lang}`} className="text-brand-green hover:underline mt-4 block">← Back to Home</Link>
      </div>
    );
  }

  const whatsapp = settings?.whatsapp || '9665269059';
  const waLink = `https://wa.me/91${whatsapp}?text=Hello%2C%20I%20am%20interested%20in%20enrolling%20for%20${encodeURIComponent(course.title)}%20at%20Trimitra%20Coaching%20Centre.`;

  const accent = TRACK_ACCENT[course.targetTrack] || TRACK_ACCENT.COMPETITIVE;
  const allFAQs = [...(course.faqs || []), ...globalFAQs].slice(0, 8);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link href={`/${lang}#courses`} className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-green mb-8 transition-colors text-sm">
          <ArrowLeft size={16} /> Back to All Courses
        </Link>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div className={`glass-card border-2 ${accent.border} p-8 mb-8 relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-current opacity-3 rounded-full blur-3xl -translate-y-16 translate-x-16" />
          <div className="relative">
            <div className="flex items-start gap-6 mb-6">
              <div className="text-5xl shrink-0">{accent.icon}</div>
              <div className="flex-1">
                <p className={`text-sm font-semibold mb-1 ${accent.color}`}>{course.subtitle || course.targetClass}</p>
                <h1 className="text-3xl md:text-4xl font-black text-white mb-3">{course.title}</h1>
                <div className="flex flex-wrap gap-2 mb-3">
                  {course.subjects.split(',').map((s: string) => (
                    <span key={s} className="badge bg-white/10 text-slate-300 border-white/20 text-xs">{s.trim()}</span>
                  ))}
                </div>
                {course.duration && (
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Clock size={14} />
                    <span>{course.duration}</span>
                    {course.targetClass && <><span className="text-white/20">·</span><Users size={14} /><span>{course.targetClass}</span></>}
                  </div>
                )}
              </div>
            </div>

            {/* Quick CTAs */}
            <div className="flex flex-wrap gap-3">
              <a href="#enroll-form-course" className="flex items-center gap-2 px-6 py-3 bg-brand-amber hover:bg-amber-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-amber-500/30 text-sm">
                <Calendar size={16} />
                Enroll Now
              </a>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-3 bg-green-600/20 border border-green-500/40 text-green-400 font-semibold rounded-xl hover:bg-green-600/30 transition-all text-sm">
                <MessageCircle size={16} />
                WhatsApp Enquiry
              </a>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content — 2/3 */}
          <div className="lg:col-span-2 space-y-6">

            {/* Course Overview */}
            {course.description && (
              <div className="glass-card p-6">
                <h2 className="text-white font-bold text-xl mb-3 flex items-center gap-2">
                  <BookOpen size={18} className={accent.color} /> Course Overview
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed">{course.description}</p>
              </div>
            )}

            {/* Who Should Join */}
            {course.whoShouldJoin && (
              <div className="glass-card p-6">
                <h2 className="text-white font-bold text-xl mb-3 flex items-center gap-2">
                  <Users size={18} className={accent.color} /> Who Should Join?
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed">{course.whoShouldJoin}</p>
              </div>
            )}

            {/* Syllabus */}
            {course.syllabus && course.syllabus.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                  <FileText size={18} className={accent.color} /> Chapter-wise Syllabus
                </h2>
                {course.syllabus.map((syl: any) => (
                  <div key={syl.id} className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`h-px flex-1 bg-gradient-to-r from-white/20 to-transparent`} />
                      <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{syl.boardExam} · {syl.academicYear}</span>
                      <div className={`h-px flex-1 bg-gradient-to-l from-white/20 to-transparent`} />
                    </div>
                    {syl.sourceNote && (
                      <p className="text-xs text-slate-500 italic mb-3">Source: {syl.sourceNote}</p>
                    )}
                    {syl.subjects.map((sub: any) => (
                      <details key={sub.id} className="group mb-3">
                        <summary className="flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer list-none hover:bg-white/8 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="text-white font-semibold text-sm">{sub.name}</span>
                            <span className="text-slate-500 text-xs">({sub.chapters.length} chapters)</span>
                          </div>
                          <ChevronDown size={16} className="text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
                        </summary>
                        <div className="divide-y divide-white/5 border border-white/10 border-t-0 rounded-b-xl overflow-hidden">
                          {sub.chapters.map((ch: any, idx: number) => (
                            <div key={ch.id} className="flex items-start justify-between px-4 py-3 bg-white/2 hover:bg-white/5 transition-colors">
                              <div className="flex items-start gap-3 flex-1">
                                <span className="text-slate-500 text-xs mt-0.5 w-5 shrink-0">{idx + 1}.</span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="text-white text-sm font-medium">
                                      {ch.isImportant && <Star size={11} className="inline text-brand-amber fill-brand-amber mr-1" />}
                                      {ch.name}
                                    </p>
                                    <span className={`text-xs px-1.5 py-0.5 rounded border ${PRIORITY_STYLES[ch.priority] || PRIORITY_STYLES.Medium}`}>{ch.priority}</span>
                                    {ch.examRelevance && ch.examRelevance.split(',').map((er: string) => er.trim()).filter(Boolean).map((er: string) => (
                                      <span key={er} className="text-xs px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded">{er}</span>
                                    ))}
                                  </div>
                                  {ch.topics && <p className="text-slate-500 text-xs mt-0.5">{ch.topics}</p>}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </details>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Exam Pattern */}
            {course.examPattern && (
              <div className="glass-card p-6">
                <h2 className="text-white font-bold text-xl mb-3 flex items-center gap-2">
                  <Target size={18} className={accent.color} /> Exam Pattern
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{course.examPattern}</p>
              </div>
            )}

            {/* Teaching Methodology */}
            {course.teachingMethodology && (
              <div className="glass-card p-6">
                <h2 className="text-white font-bold text-xl mb-3 flex items-center gap-2">
                  <BookOpen size={18} className={accent.color} /> Teaching Methodology
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed">{course.teachingMethodology}</p>
              </div>
            )}

            {/* Weekly Test Plan */}
            {course.weeklyTestPlan && (
              <div className="glass-card p-6">
                <h2 className="text-white font-bold text-xl mb-3 flex items-center gap-2">
                  <Calendar size={18} className={accent.color} /> Weekly Test Plan
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed">{course.weeklyTestPlan}</p>
              </div>
            )}

            {/* Doubt Solving */}
            {course.doubtSolvingSystem && (
              <div className="glass-card p-6">
                <h2 className="text-white font-bold text-xl mb-3 flex items-center gap-2">
                  <HelpCircle size={18} className={accent.color} /> Doubt-Solving System
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed">{course.doubtSolvingSystem}</p>
              </div>
            )}

            {/* FAQs */}
            {allFAQs.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                  <HelpCircle size={18} className={accent.color} /> Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {allFAQs.map((faq: any) => (
                    <details key={faq.id} className="group border border-white/10 rounded-xl overflow-hidden">
                      <summary className="flex items-center justify-between px-4 py-3 cursor-pointer list-none hover:bg-white/5 transition-colors">
                        <span className="text-white text-sm font-semibold pr-4">{faq.question}</span>
                        <ChevronDown size={16} className="text-slate-400 shrink-0 group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="px-4 pb-4 pt-1">
                        <p className="text-slate-300 text-sm leading-relaxed">{faq.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — 1/3 */}
          <div className="space-y-5">

            {/* Study Material */}
            {course.studyMaterial && (
              <div className="glass-card p-5">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <FileText size={16} className={accent.color} /> Study Material
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">{course.studyMaterial}</p>
              </div>
            )}

            {/* Batch Timing */}
            {course.batchTiming && (
              <div className="glass-card p-5">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <Clock size={16} className={accent.color} /> Batch Timings
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{course.batchTiming}</p>
              </div>
            )}

            {/* Key Subjects */}
            <div className="glass-card p-5">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <BookOpen size={16} className={accent.color} /> Subjects Covered
              </h3>
              <div className="flex flex-wrap gap-2">
                {course.subjects.split(',').map((s: string) => (
                  <span key={s} className="text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg font-medium">{s.trim()}</span>
                ))}
              </div>
            </div>

            {/* CTA Card */}
            <div className={`glass-card border-2 ${accent.border} p-5 text-center sticky top-6`}>
              <div className="text-3xl mb-3">{accent.icon}</div>
              <h3 className="text-white font-black text-lg mb-1">{course.title}</h3>
              <p className="text-slate-400 text-xs mb-5">{course.targetClass} · {course.duration || 'Flexible duration'}</p>

              <div className="flex items-center justify-center gap-1 mb-5">
                {[1,2,3,4,5].map(n => <Star key={n} size={14} className="text-brand-amber fill-brand-amber" />)}
                <span className="text-slate-400 text-xs ml-1">Excellent</span>
              </div>

              <a href="#enroll-form-course" className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold w-full mb-3 transition-all ${accent.color === 'text-brand-amber' ? 'bg-brand-amber text-white hover:bg-amber-500' : 'bg-brand-green text-white hover:bg-green-500'}`}>
                <Calendar size={16} />
                Enroll Now
              </a>
              <a href={waLink} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-4 border border-green-500/40 text-green-400 font-semibold rounded-xl hover:bg-green-600/10 transition-all text-sm w-full">
                <MessageCircle size={15} />
                WhatsApp Enquiry
              </a>
            </div>
          </div>
        </div>

        {/* Enroll Form */}
        <div id="enroll-form-course" className="mt-12 pt-8 border-t border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Interested in {course.title}? Enroll Now
          </h2>
          <DemoFormClient lang={lang} />
        </div>
      </div>
    </div>
  );
}
