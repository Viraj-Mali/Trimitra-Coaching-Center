import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── 1. Admin account ───────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash('trimitra@2026', 12);
  // Upsert primary admin with real WhatsApp number
  const existingAdmin1 = await prisma.student.findUnique({ where: { mobile: '9665269059' } });
  const existingAdmin2 = await prisma.student.findUnique({ where: { mobile: '9999000000' } });
  
  if (!existingAdmin1) {
    // Check if roll number exists, use a different one if needed
    const rollExists = await prisma.student.findUnique({ where: { rollNumber: 'ADM-2024-001' } });
    await prisma.student.create({
      data: {
        rollNumber: rollExists ? 'ADM-2024-SD1' : 'ADM-2024-001',
        name: 'Dr. Sarthak Dighe',
        mobile: '9665269059',
        email: 'admin@trimitra.in',
        passwordHash: adminHash,
        role: 'ADMIN',
        track: 'COMPETITIVE',
        standard: 'Admin',
      },
    });
  } else {
    await prisma.student.update({
      where: { mobile: '9665269059' },
      data: { role: 'ADMIN', passwordHash: adminHash },
    });
  }

  if (!existingAdmin2) {
    const roll2Exists = await prisma.student.findUnique({ where: { rollNumber: 'ADM-2024-002' } });
    await prisma.student.create({
      data: {
        rollNumber: roll2Exists ? 'ADM-2024-BK2' : 'ADM-2024-002',
        name: 'Admin Backup',
        mobile: '9999000000',
        email: 'admin2@trimitra.in',
        passwordHash: adminHash,
        role: 'ADMIN',
        track: 'COMPETITIVE',
        standard: 'Admin',
      },
    });
  } else {
    await prisma.student.update({
      where: { mobile: '9999000000' },
      data: { role: 'ADMIN', passwordHash: adminHash },
    });
  }
  console.log('✅ Admin accounts created');

  // ── 2. Site Settings ───────────────────────────────────────────────────────
  await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: {
      instituteName: 'Trimitra Coaching Centre',
      phone: '9665269059',
      whatsapp: '9665269059',
      email: 'info@trimitra.in',
      address: '2nd Floor, Society Complex, Talegaon Dighe, Tal. Sangamner, Dist. Ahmednagar, Maharashtra',
      logoUrl: '/logo.png',
      mentorImageUrl: '/mentor-sarthak.png',
      mapsLink: 'https://maps.google.com/?q=Talegaon+Dighe+Sangamner',
      heroHeadline: 'Personal Coaching for Class 6th to 12th, Board Exams & Competitive Exams',
      heroSubheadline: 'Focused mentorship, small batches, regular tests, doubt-solving sessions, and progress tracking under the expert guidance of Dr. Sarthak Dighe.',
    },
    create: {
      id: 'singleton',
      instituteName: 'Trimitra Coaching Centre',
      phone: '9665269059',
      whatsapp: '9665269059',
      email: 'info@trimitra.in',
      address: '2nd Floor, Society Complex, Talegaon Dighe, Tal. Sangamner, Dist. Ahmednagar, Maharashtra',
      logoUrl: '/logo.png',
      mentorImageUrl: '/mentor-sarthak.png',
      mapsLink: 'https://maps.google.com/?q=Talegaon+Dighe+Sangamner',
      heroHeadline: 'Personal Coaching for Class 6th to 12th, Board Exams & Competitive Exams',
      heroSubheadline: 'Focused mentorship, small batches, regular tests, doubt-solving sessions, and progress tracking under the expert guidance of Dr. Sarthak Dighe.',
    },
  });
  console.log('✅ Site settings seeded');

  // ── 3. Courses ─────────────────────────────────────────────────────────────
  const courseData = [
    {
      slug: 'foundation-6-to-9',
      title: 'Foundation Program',
      subtitle: 'Class 6th–9th',
      description: 'Strong foundation in Maths and Science with concept clarity, regular practice, and doubt-solving.',
      subjects: 'Maths, Science',
      targetTrack: 'FOUNDATION_6_9',
      targetClass: '6th to 9th',
      duration: '1 Academic Year',
      sortOrder: 0,
      whoShouldJoin: 'Students from Class 6th to 9th who want to build a strong conceptual base. Especially recommended for students who feel weak in Maths or Science, want to prepare early for 10th Board, or are aiming for competitive exams in future.',
      teachingMethodology: 'Concept-first teaching with real-world examples. Each topic is introduced visually, explained conceptually, and then practised through worksheets. Small batch size (max 15 students) ensures every student is noticed and guided personally.',
      weeklyTestPlan: 'Every Saturday: Chapter-wise objective test (20 MCQs, 30 minutes). Monthly: Full-syllabus test in Board-exam format. Results shared with parents via WhatsApp every Sunday.',
      doubtSolvingSystem: 'Dedicated doubt-solving session after every class (15–20 minutes). Students can also WhatsApp doubts to Dr. Sarthak between 6 PM – 8 PM on weekdays. No question goes unanswered.',
      studyMaterial: 'Customised printed notes for every chapter, worksheet booklets for practice, formula cards for quick revision, and previous year Board question papers.',
      batchTiming: 'Morning Batch: 7:00 AM – 9:00 AM | Evening Batch: 5:30 PM – 7:30 PM | Saturday: Test + Doubt Session 10:00 AM – 12:00 PM',
      examPattern: 'Aligned with Maharashtra SSC Board pattern. Tests include MCQs, short answers, and diagram-based questions as per Board format.',
      metaTitle: 'Foundation Coaching for Class 6-9 | Trimitra Coaching Centre, Talegaon Dighe',
      metaDescription: 'Best coaching classes for 6th to 9th standard in Talegaon Dighe near Sangamner. Small batches, personal attention, weekly tests. Trimitra Coaching Centre by Dr. Sarthak Dighe.',
    },
    {
      slug: '10th-board',
      title: '9th–10th Board Mastery',
      subtitle: 'SSC Board Preparation',
      description: 'Focused Maths and Science preparation for board exams with weekly tests, revision, and exam-style practice.',
      subjects: 'Maths, Science',
      targetTrack: 'BOARD_10',
      targetClass: '9th & 10th',
      duration: '1 Academic Year',
      sortOrder: 1,
      whoShouldJoin: 'Students appearing for the Maharashtra SSC Board 10th exam who want to score 85%+ or 90%+. Also suitable for students who struggled in 9th and want to build strong foundations before the Board year.',
      teachingMethodology: 'Board-exam-oriented teaching. Every concept is explained with exam-style presentation. Students practise Board-format questions from Day 1. Special focus on diagram drawing, proof writing, and answer presentation skills.',
      weeklyTestPlan: 'Weekly chapter-wise tests (Saturdays). Monthly full-syllabus prelim in exact Board format. Board-level answer writing workshops every month. Final mock exam series (3 mock exams) in February–March.',
      doubtSolvingSystem: 'Doubt-solving after every class. Dedicated Saturday doubt session (12 PM – 1 PM). WhatsApp doubt support (6 PM – 8 PM weekdays). Pre-exam revision sessions in March.',
      studyMaterial: 'Chapter-wise summary notes, diagram practice sheets, previous year question bank (5 years), expected question lists, formula booklets.',
      batchTiming: 'Morning Batch: 7:00 AM – 9:30 AM | Evening Batch: 5:00 PM – 7:30 PM | Saturday: Test + Review 10:00 AM – 1:00 PM',
      examPattern: 'Maharashtra SSC Board 2024-25 pattern: Theory (80 marks) + Internal Assessment (20 marks). MCQs, short answers, long answers, and diagram-based questions as per MSBSHSE guidelines.',
      metaTitle: '10th Board Coaching in Talegaon Dighe | Trimitra Coaching Centre',
      metaDescription: 'Best 10th SSC Board coaching in Talegaon Dighe near Sangamner. Expert coaching for Maharashtra Board 10th Maths & Science. 90%+ results consistently. Book free demo today.',
    },
    {
      slug: '11-12-science',
      title: '11th–12th Science',
      subtitle: 'PCMB Board & Entrance Foundation',
      description: 'Structured PCMB coaching for 11th–12th Science students with board and entrance-oriented preparation.',
      subjects: 'Physics, Chemistry, Mathematics, Biology',
      targetTrack: 'SCIENCE_11_12',
      targetClass: '11th & 12th',
      duration: '2 Academic Years',
      sortOrder: 2,
      whoShouldJoin: 'Students who have passed 10th and are joining 11th Science. Suitable for both HSC-only students and those planning JEE/NEET/MHT-CET. Early joiners (June batch) get maximum benefit.',
      teachingMethodology: 'Parallel Board + entrance preparation. HSC concepts taught first to build foundation, then extended to JEE/NEET/MHT-CET application level. Regular NTA-pattern MCQ practice alongside Board-format long-answer practice.',
      weeklyTestPlan: 'Weekly: Chapter-wise objective test (30 MCQs, 45 minutes). Bi-weekly: Board-format long-answer test. Monthly: Full-syllabus test (Board + entrance combined). Quarterly: Full-length mock test in exam hall conditions.',
      doubtSolvingSystem: 'Subject-wise doubt sessions (Physics on Monday, Chemistry on Wednesday, Maths on Friday). WhatsApp doubt support. Peer study groups facilitated by Dr. Sarthak. Pre-exam intensive revision sessions.',
      studyMaterial: 'Detailed chapter notes (Board + JEE/NEET level), formula sheets, solved previous year papers (HSC + JEE/NEET/MHT-CET), DPP (Daily Practice Problems), revision booklets.',
      batchTiming: '11th Batch: 7:30 AM – 10:00 AM | 12th Batch: 4:30 PM – 7:30 PM | Sunday: Combined test + analysis 9:00 AM – 12:00 PM',
      examPattern: 'Dual pattern: (1) MSBSHSE HSC Board pattern — theory papers, practicals (2) JEE Main: NTA CBT format, 90 questions, 3 hours. NEET: 180 MCQs, 3 hours. MHT-CET: 150 MCQs, 3 hours.',
      metaTitle: '11th 12th Science Coaching near Sangamner | JEE NEET MHT-CET HSC | Trimitra',
      metaDescription: 'Best 11th 12th Science coaching in Talegaon Dighe near Sangamner. HSC Board + JEE/NEET/MHT-CET preparation. Expert Physics, Chemistry, Maths tuition. Trimitra Coaching Centre.',
    },
    {
      slug: 'jee',
      title: 'JEE (Main & Adv)',
      subtitle: 'Engineering Entrance',
      description: 'Rigorous preparation for top-tier engineering colleges across India.',
      subjects: 'Physics, Chemistry, Maths',
      targetTrack: 'COMPETITIVE_JEE',
      targetClass: '11th, 12th & Droppers',
      duration: '1-2 Years',
      sortOrder: 3,
      whoShouldJoin: 'Class 11th, 12th students or droppers preparing for IIT-JEE Main and Advanced.',
      teachingMethodology: 'Exam-strategy-first approach. Topics covered in NTA exam priority order.',
      weeklyTestPlan: 'Daily: Topic-wise 30-question practice set. Weekly: Chapter-wise mock. Monthly: Full-length NTA pattern test.',
      doubtSolvingSystem: 'Daily doubt-solving at end of each session. Dedicated WhatsApp group.',
      studyMaterial: 'Exam-focused notes (NTA pattern), 10-year previous papers with solutions, topic-wise question banks.',
      batchTiming: 'Morning Intensive: 7:00 AM – 11:00 AM | Evening Batch: 4:00 PM – 8:00 PM',
      examPattern: 'JEE Main (NTA): 90 questions | 3 hours | CBT mode | Sections: Physics (30), Chemistry (30), Maths (30).',
      metaTitle: 'JEE Coaching near Sangamner | Trimitra Coaching Centre',
      metaDescription: 'Expert JEE Main and Advanced coaching in Talegaon Dighe near Sangamner.',
    },
    {
      slug: 'neet',
      title: 'NEET UG',
      subtitle: 'Medical Entrance',
      description: 'Focused preparation for national level medical entrance examinations.',
      subjects: 'Physics, Chemistry, Biology',
      targetTrack: 'COMPETITIVE_NEET',
      targetClass: '11th, 12th & Droppers',
      duration: '1-2 Years',
      sortOrder: 4,
      whoShouldJoin: 'Class 11th, 12th students or droppers preparing for NEET UG.',
      teachingMethodology: 'NCERT-focused strategy approach. Daily rigorous biology revision.',
      weeklyTestPlan: 'Daily: Topic-wise 30-question practice set. Weekly: Chapter-wise mock. Monthly: Full-length 180 MCQ pattern test.',
      doubtSolvingSystem: 'Daily doubt-solving at end of each session. Dedicated WhatsApp group.',
      studyMaterial: 'NCERT extract notes, 10-year previous papers with solutions, topic-wise question banks.',
      batchTiming: 'Morning Intensive: 7:00 AM – 11:00 AM | Evening Batch: 4:00 PM – 8:00 PM',
      examPattern: 'NEET UG (NTA): 200 questions (attempt 180) | 3 hours | Physics, Chemistry, Biology.',
      metaTitle: 'NEET Coaching near Sangamner | Trimitra Coaching Centre',
      metaDescription: 'Expert NEET UG coaching in Talegaon Dighe near Sangamner.',
    },
    {
      slug: 'mht-cet',
      title: 'MHT-CET',
      subtitle: 'State Engineering & Pharmacy',
      description: 'Structured preparation for Maharashtra state level entrance exams.',
      subjects: 'Physics, Chemistry, Maths/Biology',
      targetTrack: 'COMPETITIVE_MHTCET',
      targetClass: '11th & 12th',
      duration: '1-2 Years',
      sortOrder: 5,
      whoShouldJoin: 'Class 11th, 12th students preparing for Maharashtra CET.',
      teachingMethodology: 'HSC textbook-focused strategy approach aligned with CET Cell guidelines.',
      weeklyTestPlan: 'Daily: Topic-wise practice set. Weekly: Chapter-wise mock. Monthly: Full-length CET pattern test.',
      doubtSolvingSystem: 'Daily doubt-solving at end of each session. Dedicated WhatsApp group.',
      studyMaterial: 'HSC extract notes, previous papers with solutions, CET targeted question banks.',
      batchTiming: 'Morning Intensive: 7:00 AM – 11:00 AM | Evening Batch: 4:00 PM – 8:00 PM',
      examPattern: 'MHT-CET: 150 MCQs | 3 hours | Maths/Physics/Chemistry or Bio.',
      metaTitle: 'MHT-CET Coaching near Sangamner | Trimitra Coaching Centre',
      metaDescription: 'Expert MHT-CET coaching in Talegaon Dighe near Sangamner.',
    },
  ];

  for (const data of courseData) {
    await prisma.course.upsert({
      where: { slug: data.slug },
      update: data,
      create: data,
    });
  }
  console.log('✅ Courses seeded');

  // Get course IDs for relations
  const courses = await prisma.course.findMany({ select: { id: true, slug: true } });
  const courseMap = Object.fromEntries(courses.map(c => [c.slug, c.id]));

  // ── 4. Syllabus Data ────────────────────────────────────────────────────────
  // Foundation 6-9 Syllabus
  const foundationSyllabus = await prisma.syllabus.upsert({
    where: { id: 'syllabus-foundation' },
    update: {},
    create: {
      id: 'syllabus-foundation',
      courseId: courseMap['foundation-6-to-9'],
      boardExam: 'Maharashtra SSC Board (Std 6–9)',
      academicYear: '2024-25',
      isActive: true,
      sortOrder: 0,
      sourceNote: 'Based on MSBSHSE Balbharati textbook chapter structure for Std 6–9 and Maharashtra State curriculum guidelines.',
    },
  });

  const foundationSubjects = [
    {
      id: 'fsub-maths', name: 'Mathematics', sortOrder: 0,
      chapters: [
        { name: 'Natural Numbers and Whole Numbers', topics: 'Number line, place value, operations, properties', priority: 'High', examRelevance: 'Board', isImportant: true },
        { name: 'Fractions and Decimals', topics: 'Types of fractions, operations, conversion, word problems', priority: 'High', examRelevance: 'Board', isImportant: true },
        { name: 'Basic Algebra (Algebraic Expressions)', topics: 'Variables, constants, terms, degree, addition/subtraction of expressions', priority: 'High', examRelevance: 'Board', isImportant: true },
        { name: 'Geometry — Lines and Angles', topics: 'Types of angles, parallel lines, transversal, angle properties', priority: 'Medium', examRelevance: 'Board', isImportant: false },
        { name: 'Triangles and Quadrilaterals', topics: 'Classification, properties, angle sum, congruence basics', priority: 'High', examRelevance: 'Board', isImportant: true },
        { name: 'Mensuration (Perimeter, Area, Volume)', topics: 'Perimeter and area of 2D figures, volume of 3D solids', priority: 'High', examRelevance: 'Board', isImportant: true },
        { name: 'Ratio and Proportion', topics: 'Ratio, unitary method, direct and inverse proportion', priority: 'Medium', examRelevance: 'Board', isImportant: false },
        { name: 'Data Handling and Statistics', topics: 'Bar graph, frequency table, mean, median, mode', priority: 'Medium', examRelevance: 'Board', isImportant: false },
      ],
    },
    {
      id: 'fsub-science', name: 'Science', sortOrder: 1,
      chapters: [
        { name: 'Matter and Its Properties', topics: 'States of matter, physical and chemical changes, elements, compounds, mixtures', priority: 'High', examRelevance: 'Board', isImportant: true },
        { name: 'Force and Motion', topics: 'Types of forces, Newton\'s laws (intro), speed, velocity, distance-time graphs', priority: 'High', examRelevance: 'Board', isImportant: true },
        { name: 'Light and Sound', topics: 'Reflection, refraction basics, sound propagation, pitch, loudness', priority: 'Medium', examRelevance: 'Board', isImportant: false },
        { name: 'Living World — Cell to Organism', topics: 'Cell structure, plant and animal cells, photosynthesis, respiration (intro)', priority: 'High', examRelevance: 'Board', isImportant: true },
        { name: 'Human Body Systems', topics: 'Digestive, circulatory, respiratory, nervous system (introductory)', priority: 'Medium', examRelevance: 'Board', isImportant: false },
        { name: 'Environment and Ecosystem', topics: 'Food chains, biodiversity, natural resources, pollution awareness', priority: 'Low', examRelevance: 'Board', isImportant: false },
      ],
    },
  ];

  for (const sub of foundationSubjects) {
    await prisma.syllabusSubject.upsert({
      where: { id: sub.id },
      update: {},
      create: {
        id: sub.id,
        syllabusId: foundationSyllabus.id,
        name: sub.name,
        sortOrder: sub.sortOrder,
        chapters: {
          create: sub.chapters.map((ch, idx) => ({
            name: ch.name,
            topics: ch.topics,
            priority: ch.priority,
            examRelevance: ch.examRelevance,
            sortOrder: idx,
            isImportant: ch.isImportant,
            isActive: true,
          })),
        },
      },
    });
  }
  console.log('✅ Foundation syllabus seeded');

  // 10th Board Syllabus
  const board10Syllabus = await prisma.syllabus.upsert({
    where: { id: 'syllabus-board10' },
    update: {},
    create: {
      id: 'syllabus-board10',
      courseId: courseMap['10th-board'],
      boardExam: 'Maharashtra SSC Board 10th',
      academicYear: '2024-25',
      isActive: true,
      sortOrder: 0,
      sourceNote: 'Based on MSBSHSE SSC Board official syllabus and Balbharati textbook chapter structure for Std 10, 2024-25.',
    },
  });

  const board10Subjects = [
    {
      id: 'b10sub-maths', name: 'Algebra & Geometry (Mathematics)', sortOrder: 0,
      chapters: [
        { name: 'Linear Equations in Two Variables', topics: 'Graphical method, substitution, elimination, word problems', priority: 'High', examRelevance: 'Board', isImportant: true },
        { name: 'Quadratic Equations', topics: 'Factorisation, formula method, nature of roots, word problems', priority: 'High', examRelevance: 'Board', isImportant: true },
        { name: 'Arithmetic Progression', topics: 'nth term, sum of n terms, word problems', priority: 'High', examRelevance: 'Board', isImportant: true },
        { name: 'Probability', topics: 'Basic probability, sample space, events, solved examples', priority: 'Medium', examRelevance: 'Board', isImportant: false },
        { name: 'Statistics', topics: 'Mean, median, mode (grouped data), ogive, histogram', priority: 'Medium', examRelevance: 'Board', isImportant: false },
        { name: 'Similarity and Circles', topics: 'Theorems, proofs, angle subtended, tangent properties', priority: 'High', examRelevance: 'Board', isImportant: true },
        { name: 'Co-ordinate Geometry', topics: 'Distance formula, section formula, slope of line', priority: 'Medium', examRelevance: 'Board', isImportant: true },
        { name: 'Trigonometry', topics: 'Ratios, identities, heights and distances', priority: 'High', examRelevance: 'Board', isImportant: true },
        { name: 'Mensuration (3D Solids)', topics: 'Surface area and volume — cylinder, cone, sphere, frustum', priority: 'High', examRelevance: 'Board', isImportant: true },
      ],
    },
    {
      id: 'b10sub-sci1', name: 'Science I (Physics & Chemistry)', sortOrder: 1,
      chapters: [
        { name: 'Gravitation', topics: 'Newton\'s law, free fall, mass vs weight, pressure', priority: 'High', examRelevance: 'Board', isImportant: true },
        { name: 'Periodic Classification of Elements', topics: 'Mendeleev, Modern Periodic Table, trends in properties', priority: 'High', examRelevance: 'Board', isImportant: true },
        { name: 'Chemical Reactions and Equations', topics: 'Types of reactions, balancing equations, oxidation-reduction', priority: 'High', examRelevance: 'Board', isImportant: true },
        { name: 'Acids, Bases and Salts', topics: 'pH, indicators, neutralisation, important salts', priority: 'High', examRelevance: 'Board', isImportant: true },
        { name: 'Light — Refraction and Reflection', topics: 'Laws, mirrors, lenses, power, human eye, defects', priority: 'High', examRelevance: 'Board', isImportant: true },
        { name: 'Electricity', topics: 'Ohm\'s law, resistance, series-parallel, heating effect, MCB', priority: 'High', examRelevance: 'Board', isImportant: true },
        { name: 'Carbon Compounds', topics: 'Organic chemistry basics, hydrocarbons, functional groups', priority: 'Medium', examRelevance: 'Board', isImportant: false },
      ],
    },
    {
      id: 'b10sub-sci2', name: 'Science II (Biology)', sortOrder: 2,
      chapters: [
        { name: 'Life Processes', topics: 'Nutrition, respiration, transportation, excretion', priority: 'High', examRelevance: 'Board', isImportant: true },
        { name: 'Heredity and Evolution', topics: 'Mendel\'s laws, sex determination, Darwin, speciation', priority: 'High', examRelevance: 'Board', isImportant: true },
        { name: 'Control and Coordination', topics: 'Nervous system, hormones, reflex arc', priority: 'High', examRelevance: 'Board', isImportant: true },
        { name: 'How Do Organisms Reproduce', topics: 'Asexual, sexual reproduction, reproductive health', priority: 'Medium', examRelevance: 'Board', isImportant: false },
        { name: 'Our Environment', topics: 'Ecosystem, food chain, ozone, waste management', priority: 'Low', examRelevance: 'Board', isImportant: false },
      ],
    },
  ];

  for (const sub of board10Subjects) {
    await prisma.syllabusSubject.upsert({
      where: { id: sub.id },
      update: {},
      create: {
        id: sub.id,
        syllabusId: board10Syllabus.id,
        name: sub.name,
        sortOrder: sub.sortOrder,
        chapters: {
          create: sub.chapters.map((ch, idx) => ({
            name: ch.name,
            topics: ch.topics,
            priority: ch.priority,
            examRelevance: ch.examRelevance,
            sortOrder: idx,
            isImportant: ch.isImportant,
            isActive: true,
          })),
        },
      },
    });
  }
  console.log('✅ 10th Board syllabus seeded');

  // 11-12 Science Syllabus
  const sci1112Syllabus = await prisma.syllabus.upsert({
    where: { id: 'syllabus-sci1112' },
    update: {},
    create: {
      id: 'syllabus-sci1112',
      courseId: courseMap['11-12-science'],
      boardExam: 'MSBSHSE HSC Board + JEE/NEET/MHT-CET',
      academicYear: '2024-25',
      isActive: true,
      sortOrder: 0,
      sourceNote: 'Based on MSBSHSE HSC Science syllabus 2024-25, cross-referenced with NTA JEE Main 2024 Information Bulletin and NTA NEET UG 2024 syllabus (reduced syllabus as per NMC).',
    },
  });

  const sci1112Subjects = [
    {
      id: 's1112sub-phy', name: 'Physics', sortOrder: 0,
      chapters: [
        { name: 'Rotational Dynamics', topics: 'Moment of inertia, torque, angular momentum, rolling motion', priority: 'High', examRelevance: 'Board,JEE,MHT-CET', isImportant: true },
        { name: 'Gravitation', topics: 'Kepler\'s laws, gravitational potential, escape velocity, satellites', priority: 'High', examRelevance: 'Board,JEE,NEET,MHT-CET', isImportant: true },
        { name: 'Oscillations and Waves', topics: 'SHM, energy in SHM, superposition, wave types, Doppler effect', priority: 'High', examRelevance: 'Board,JEE,MHT-CET', isImportant: true },
        { name: 'Thermodynamics', topics: 'Laws, heat engines, entropy, Carnot cycle, specific heats of gases', priority: 'High', examRelevance: 'Board,JEE,MHT-CET', isImportant: true },
        { name: 'Electrostatics', topics: 'Coulomb\'s law, electric field, potential, capacitors, Gauss\'s law', priority: 'High', examRelevance: 'Board,JEE,NEET,MHT-CET', isImportant: true },
        { name: 'Current Electricity', topics: 'Ohm\'s law, Kirchhoff\'s laws, Wheatstone bridge, meter bridge', priority: 'High', examRelevance: 'Board,JEE,NEET,MHT-CET', isImportant: true },
        { name: 'Magnetism and Electromagnetic Induction', topics: 'Biot-Savart law, Ampere\'s law, Faraday\'s law, AC/DC, transformers', priority: 'High', examRelevance: 'Board,JEE,NEET,MHT-CET', isImportant: true },
        { name: 'Modern Physics (Dual Nature, Atoms, Nuclei)', topics: 'Photoelectric effect, de Broglie, Bohr model, radioactivity, nuclear reactions', priority: 'High', examRelevance: 'Board,JEE,NEET,MHT-CET', isImportant: true },
        { name: 'Semiconductors and Communication', topics: 'p-n junction, diode, transistor, logic gates, communication basics', priority: 'Medium', examRelevance: 'Board,JEE,MHT-CET', isImportant: false },
      ],
    },
    {
      id: 's1112sub-chem', name: 'Chemistry', sortOrder: 1,
      chapters: [
        { name: 'Solid State', topics: 'Crystal systems, packing, defects, electrical properties', priority: 'Medium', examRelevance: 'Board,JEE,MHT-CET', isImportant: false },
        { name: 'Solutions and Colligative Properties', topics: 'Concentration, Raoult\'s law, boiling point elevation, osmosis', priority: 'High', examRelevance: 'Board,JEE,MHT-CET', isImportant: true },
        { name: 'Electrochemistry', topics: 'Galvanic cells, EMF, Nernst equation, electrolysis, batteries, corrosion', priority: 'High', examRelevance: 'Board,JEE,NEET,MHT-CET', isImportant: true },
        { name: 'Chemical Kinetics', topics: 'Rate of reaction, rate law, Arrhenius equation, order, mechanisms', priority: 'High', examRelevance: 'Board,JEE,MHT-CET', isImportant: true },
        { name: 'Coordination Chemistry', topics: 'Werner\'s theory, IUPAC naming, isomerism, bonding theories, applications', priority: 'High', examRelevance: 'Board,JEE,MHT-CET', isImportant: true },
        { name: 'Organic Chemistry (Reactions)', topics: 'Substitution, elimination, addition reactions, mechanisms, GOC', priority: 'High', examRelevance: 'Board,JEE,NEET,MHT-CET', isImportant: true },
        { name: 'Aldehydes, Ketones and Carboxylic Acids', topics: 'Preparation, reactions, tests, industrial applications', priority: 'High', examRelevance: 'Board,JEE,NEET,MHT-CET', isImportant: true },
        { name: 'Amines and Diazonium Salts', topics: 'Classification, preparation, reactions, coupling', priority: 'Medium', examRelevance: 'Board,JEE,MHT-CET', isImportant: false },
        { name: 'Biomolecules and Polymers', topics: 'Carbohydrates, proteins, nucleic acids, polymer types, vulcanisation', priority: 'Medium', examRelevance: 'Board,NEET', isImportant: false },
      ],
    },
    {
      id: 's1112sub-math', name: 'Mathematics', sortOrder: 2,
      chapters: [
        { name: 'Trigonometry (Inverse and General Solutions)', topics: 'Inverse trig functions, principal values, general solutions of equations', priority: 'High', examRelevance: 'Board,JEE,MHT-CET', isImportant: true },
        { name: 'Matrices and Determinants', topics: 'Operations, inverse, Cramer\'s rule, linear equations', priority: 'High', examRelevance: 'Board,JEE,MHT-CET', isImportant: true },
        { name: 'Limits, Continuity and Differentiability', topics: 'Limit theorems, L\'Hopital, continuity, differentiability, MVT', priority: 'High', examRelevance: 'Board,JEE,MHT-CET', isImportant: true },
        { name: 'Differentiation and Applications', topics: 'Rules, implicit, parametric, logarithmic; maxima/minima, tangent/normal', priority: 'High', examRelevance: 'Board,JEE,MHT-CET', isImportant: true },
        { name: 'Integration and Its Applications', topics: 'Methods, definite integration, area under curve, trapezoidal rule', priority: 'High', examRelevance: 'Board,JEE,MHT-CET', isImportant: true },
        { name: 'Vectors and 3D Geometry', topics: 'Dot/cross product, lines and planes in 3D, angles, distances', priority: 'High', examRelevance: 'Board,JEE,MHT-CET', isImportant: true },
        { name: 'Probability (Advanced)', topics: 'Conditional probability, Bayes\' theorem, probability distributions', priority: 'Medium', examRelevance: 'Board,JEE,MHT-CET', isImportant: false },
      ],
    },
  ];

  for (const sub of sci1112Subjects) {
    await prisma.syllabusSubject.upsert({
      where: { id: sub.id },
      update: {},
      create: {
        id: sub.id,
        syllabusId: sci1112Syllabus.id,
        name: sub.name,
        sortOrder: sub.sortOrder,
        chapters: {
          create: sub.chapters.map((ch, idx) => ({
            name: ch.name,
            topics: ch.topics,
            priority: ch.priority,
            examRelevance: ch.examRelevance,
            sortOrder: idx,
            isImportant: ch.isImportant,
            isActive: true,
          })),
        },
      },
    });
  }
  console.log('✅ 11-12 Science syllabus seeded');

  // Competitive Exam Syllabus
  const compSyllabus = await prisma.syllabus.upsert({
    where: { id: 'syllabus-competitive' },
    update: {},
    create: {
      id: 'syllabus-competitive',
      courseId: courseMap['jee-neet-mht-cet-nata'],
      boardExam: 'JEE Main | NEET UG | MHT-CET | NATA',
      academicYear: '2024-25',
      isActive: true,
      sortOrder: 0,
      sourceNote: 'Based on NTA JEE Main 2024 Information Bulletin, NTA NEET UG 2024 (NMC reduced syllabus), State CET Cell Maharashtra MHT-CET 2024 Information Brochure, and CoA NATA 2024 Brochure.',
    },
  });

  const compSubjects = [
    {
      id: 'csub-phy', name: 'Physics (JEE/NEET/MHT-CET)', sortOrder: 0,
      chapters: [
        { name: 'Mechanics — Laws of Motion and Gravitation', topics: 'Newton\'s laws, friction, circular motion, work-energy, momentum, gravitation', priority: 'High', examRelevance: 'JEE,NEET,MHT-CET', isImportant: true },
        { name: 'Rotational Motion and Rigid Body Dynamics', topics: 'Torque, moment of inertia, angular momentum, conservation, rolling', priority: 'High', examRelevance: 'JEE,MHT-CET', isImportant: true },
        { name: 'Thermodynamics and Kinetic Theory', topics: 'Laws of thermodynamics, entropy, heat engines, Carnot cycle, kinetic theory', priority: 'High', examRelevance: 'JEE,NEET,MHT-CET', isImportant: true },
        { name: 'Electrostatics and Current Electricity', topics: 'Electric field, potential, Gauss\'s law, capacitors, Ohm\'s law, Kirchhoff\'s laws', priority: 'High', examRelevance: 'JEE,NEET,MHT-CET', isImportant: true },
        { name: 'Magnetic Effects and Electromagnetic Induction', topics: 'Biot-Savart, Faraday\'s law, Lenz\'s law, AC circuits, LC circuits', priority: 'High', examRelevance: 'JEE,NEET,MHT-CET', isImportant: true },
        { name: 'Optics — Ray and Wave', topics: 'Snell\'s law, lenses, mirrors, diffraction, interference, polarization, YDSE', priority: 'High', examRelevance: 'JEE,NEET,MHT-CET', isImportant: true },
        { name: 'Modern Physics (Dual Nature, Atom, Nucleus)', topics: 'Photoelectric effect, Bohr model, X-rays, radioactivity, nuclear energy', priority: 'High', examRelevance: 'JEE,NEET,MHT-CET', isImportant: true },
        { name: 'Semiconductors and Communication Systems', topics: 'p-n junction, transistor circuits, logic gates, AM/FM, modulation', priority: 'Medium', examRelevance: 'JEE,MHT-CET', isImportant: false },
      ],
    },
    {
      id: 'csub-chem', name: 'Chemistry (JEE/NEET/MHT-CET)', sortOrder: 1,
      chapters: [
        { name: 'Physical Chemistry — Atomic Structure and Bonding', topics: 'Quantum numbers, orbital shapes, hybridization, VSEPR, MO theory', priority: 'High', examRelevance: 'JEE,NEET,MHT-CET', isImportant: true },
        { name: 'Equilibrium (Chemical and Ionic)', topics: 'Kc, Kp, Le Chatelier\'s principle, pH, buffer solutions, solubility product', priority: 'High', examRelevance: 'JEE,NEET,MHT-CET', isImportant: true },
        { name: 'Electrochemistry and Chemical Kinetics', topics: 'Galvanic cells, Nernst equation, rate law, Arrhenius equation, order', priority: 'High', examRelevance: 'JEE,NEET,MHT-CET', isImportant: true },
        { name: 'Inorganic Chemistry — p-block and d-block Elements', topics: 'Electronic configuration, properties, compounds, uses; transition metals', priority: 'High', examRelevance: 'JEE,NEET,MHT-CET', isImportant: true },
        { name: 'Organic Chemistry — GOC and Reaction Mechanisms', topics: 'Inductive, mesomeric effects; SN1, SN2, E1, E2; rearrangements', priority: 'High', examRelevance: 'JEE,NEET,MHT-CET', isImportant: true },
        { name: 'Organic Conversions and Named Reactions', topics: 'Aldol condensation, Cannizzaro, Grignard, Friedel-Crafts, Reimer-Tiemann', priority: 'High', examRelevance: 'JEE,NEET,MHT-CET', isImportant: true },
        { name: 'Biomolecules and Chemistry in Everyday Life', topics: 'Carbohydrates, proteins, enzymes, vitamins, drugs, polymers', priority: 'Medium', examRelevance: 'NEET,MHT-CET', isImportant: false },
      ],
    },
    {
      id: 'csub-math', name: 'Mathematics (JEE/MHT-CET)', sortOrder: 2,
      chapters: [
        { name: 'Algebra — Complex Numbers and Quadratics', topics: 'Argand plane, modulus, amplitude, De Moivre\'s theorem; quadratic inequalities', priority: 'High', examRelevance: 'JEE,MHT-CET', isImportant: true },
        { name: 'Sequences, Series and Permutations', topics: 'AP, GP, HP; nCr, nPr; binomial theorem; applications', priority: 'High', examRelevance: 'JEE,MHT-CET', isImportant: true },
        { name: 'Calculus — Limits, Differentiation, Integration', topics: 'Indeterminate forms, L\'Hopital; chain rule, implicit; definite integrals, area', priority: 'High', examRelevance: 'JEE,MHT-CET', isImportant: true },
        { name: 'Differential Equations', topics: 'Order, degree, variable separable, homogeneous, linear 1st order', priority: 'Medium', examRelevance: 'JEE,MHT-CET', isImportant: false },
        { name: 'Coordinate Geometry (Conics)', topics: 'Parabola, ellipse, hyperbola: standard form, tangent, normal, chord', priority: 'High', examRelevance: 'JEE,MHT-CET', isImportant: true },
        { name: 'Vectors and 3D Geometry', topics: 'Direction cosines, line/plane equations, angles, distances, intersection', priority: 'High', examRelevance: 'JEE,MHT-CET', isImportant: true },
        { name: 'Probability and Statistics', topics: 'Bayes\' theorem, binomial distribution, mean, variance', priority: 'Medium', examRelevance: 'JEE,MHT-CET', isImportant: false },
      ],
    },
    {
      id: 'csub-bio', name: 'Biology (NEET UG)', sortOrder: 3,
      chapters: [
        { name: 'Cell Biology — Structure and Function', topics: 'Prokaryotic, eukaryotic cells; organelles, cell cycle, mitosis, meiosis', priority: 'High', examRelevance: 'NEET', isImportant: true },
        { name: 'Genetics and Molecular Biology', topics: 'Mendel\'s laws, linkage, mutations, DNA replication, transcription, translation', priority: 'High', examRelevance: 'NEET', isImportant: true },
        { name: 'Human Physiology — Systems', topics: 'Digestion, circulation (heart, blood), excretion, nervous, endocrine, reproduction', priority: 'High', examRelevance: 'NEET', isImportant: true },
        { name: 'Plant Kingdom and Ecology', topics: 'Classification, morphology, reproduction; ecosystems, biodiversity, conservation', priority: 'High', examRelevance: 'NEET', isImportant: true },
        { name: 'Evolution and Biotechnology', topics: 'Theories of evolution, speciation, genetic engineering, PCR, cloning, GMOs', priority: 'Medium', examRelevance: 'NEET', isImportant: false },
      ],
    },
    {
      id: 'csub-nata', name: 'General Aptitude & Drawing (NATA)', sortOrder: 4,
      chapters: [
        { name: 'Architectural Aptitude and Spatial Awareness', topics: 'Visualisation, 2D/3D sketching, elevation, plan, section views', priority: 'High', examRelevance: 'NATA', isImportant: true },
        { name: 'Freehand Drawing and Composition', topics: 'Objects, scenes from memory, perspective drawing, shading, texture', priority: 'High', examRelevance: 'NATA', isImportant: true },
        { name: 'Logical and Analytical Reasoning', topics: 'Series, patterns, analogies, non-verbal reasoning, data interpretation', priority: 'High', examRelevance: 'NATA', isImportant: true },
        { name: 'Mathematical Reasoning', topics: 'Algebra, geometry, mensuration, statistics, sets, graphs (10+2 level)', priority: 'Medium', examRelevance: 'NATA', isImportant: false },
      ],
    },
  ];

  for (const sub of compSubjects) {
    await prisma.syllabusSubject.upsert({
      where: { id: sub.id },
      update: {},
      create: {
        id: sub.id,
        syllabusId: compSyllabus.id,
        name: sub.name,
        sortOrder: sub.sortOrder,
        chapters: {
          create: sub.chapters.map((ch, idx) => ({
            name: ch.name,
            topics: ch.topics,
            priority: ch.priority,
            examRelevance: ch.examRelevance,
            sortOrder: idx,
            isImportant: ch.isImportant,
            isActive: true,
          })),
        },
      },
    });
  }
  console.log('✅ Competitive exam syllabus seeded');

  // ── 5. Quiz Questions ───────────────────────────────────────────────────────
  const existingQuestions = await prisma.quizQuestion.count();
  if (existingQuestions === 0) {
    const questions = [
      { question: 'What is the value of π (pi) to two decimal places?', optionA: '3.12', optionB: '3.14', optionC: '3.16', optionD: '3.18', correctIndex: 1, explanation: 'π ≈ 3.14159..., which rounds to 3.14', track: 'FOUNDATION_6_9', subject: 'Mathematics' },
      { question: 'Which planet is known as the Red Planet?', optionA: 'Venus', optionB: 'Jupiter', optionC: 'Mars', optionD: 'Saturn', correctIndex: 2, explanation: 'Mars appears red due to iron oxide (rust) on its surface.', track: 'FOUNDATION_6_9', subject: 'Science' },
      { question: 'What is the chemical formula of water?', optionA: 'H2O2', optionB: 'HO', optionC: 'H2O', optionD: 'H3O', correctIndex: 2, explanation: 'Water consists of 2 hydrogen atoms and 1 oxygen atom.', track: 'BOARD_10', subject: 'Chemistry' },
      { question: 'State the formula for the area of a circle.', optionA: '2πr', optionB: 'πr²', optionC: 'πd', optionD: '2πr²', correctIndex: 1, explanation: 'Area of a circle = πr², where r is the radius.', track: 'BOARD_10', subject: 'Mathematics' },
      { question: "Newton's Second Law of Motion states F = ?", optionA: 'ma', optionB: 'mv', optionC: 'mg', optionD: 'ma²', correctIndex: 0, explanation: 'Force equals mass times acceleration (F = ma).', track: 'SCIENCE_11_12', subject: 'Physics' },
      { question: 'What is the atomic number of Carbon?', optionA: '4', optionB: '6', optionC: '8', optionD: '12', correctIndex: 1, explanation: 'Carbon has 6 protons, giving it atomic number 6.', track: 'SCIENCE_11_12', subject: 'Chemistry' },
      { question: "The escape velocity from Earth's surface is approximately:", optionA: '7.9 km/s', optionB: '9.8 km/s', optionC: '11.2 km/s', optionD: '25 km/s', correctIndex: 2, explanation: "Earth's escape velocity is ≈ 11.2 km/s, enough to escape gravitational pull.", track: 'COMPETITIVE', subject: 'Physics' },
      { question: 'The IUPAC name of CH₃COOH is:', optionA: 'Methanoic acid', optionB: 'Ethanoic acid', optionC: 'Propanoic acid', optionD: 'Butanoic acid', correctIndex: 1, explanation: 'CH₃COOH (acetic acid) is ethanoic acid in IUPAC nomenclature.', track: 'COMPETITIVE', subject: 'Chemistry' },
      { question: 'The integration of sin(x) is:', optionA: 'cos(x) + C', optionB: '-cos(x) + C', optionC: 'sin(x) + C', optionD: '-sin(x) + C', correctIndex: 1, explanation: '∫sin(x)dx = -cos(x) + C', track: 'COMPETITIVE', subject: 'Mathematics' },
    ];
    for (const q of questions) { await prisma.quizQuestion.create({ data: q }); }
    console.log(`✅ ${questions.length} quiz questions seeded`);
  }

  // ── 6. Notices ──────────────────────────────────────────────────────────────
  const existingNotices = await prisma.notice.count();
  if (existingNotices === 0) {
    await prisma.notice.createMany({
      data: [
        { title: 'Welcome to Trimitra Coaching Centre!', body: 'We are excited to have you on board. Please check the materials section for your study resources and complete your daily quiz to maintain your streak.', targetTrack: null, isUrgent: false },
        { title: 'JEE / NEET Batch — June 2025 Schedule', body: 'The competitive batch schedule for June 2025 has been updated. Morning batch starts at 7:00 AM sharp. Contact Dr. Sarthak on WhatsApp (9665269059) for queries.', targetTrack: 'COMPETITIVE', isUrgent: true },
        { title: '10th Board Mock Test — Dates Announced', body: 'The first full-syllabus mock test for 10th Board students is scheduled for June 28, 2025. All enrolled students will receive test instructions on their dashboard.', targetTrack: 'BOARD_10', isUrgent: false },
      ],
    });
    console.log('✅ Sample notices seeded');
  }

  // ── 7. Testimonials ─────────────────────────────────────────────────────────
  console.log('⏭️ Testimonials seeding skipped (new coaching center)');

  // ── 8. Results ─────────────────────────────────────────────────────────────
  console.log('⏭️ Results seeding skipped (new coaching center)');

  // ── 9. FAQs ────────────────────────────────────────────────────────────────
  const existingFAQs = await prisma.fAQ.count();
  if (existingFAQs === 0) {
    await prisma.fAQ.createMany({
      data: [
        { question: 'How is the demo class conducted?', answer: 'The free demo class is a one-hour session with Dr. Sarthak Dighe where you or your child will experience our teaching style firsthand. There is no test or pressure — just a genuine learning experience. We also discuss your current level, target goals, and the best course/batch for you. To book, just fill the form on this page or WhatsApp us on 9665269059.', sortOrder: 0, isActive: true },
        { question: 'What are the batch timings?', answer: 'We have morning and evening batches on weekdays. Morning batches typically run from 7:00 AM – 9:30 AM and evening batches from 5:00 PM – 7:30 PM. Saturdays are dedicated to tests and doubt-solving sessions. Exact timings vary by course. Contact us for the latest schedule.', sortOrder: 1, isActive: true },
        { question: 'How many students are there in each batch?', answer: 'We strictly maintain a maximum of 15–20 students per batch. This is core to our teaching philosophy — every student must be personally noticed, guided, and tracked. We do not run large classes.', sortOrder: 2, isActive: true },
        { question: 'Do you provide study material?', answer: 'Yes. Every enrolled student receives customised printed chapter notes, worksheet booklets, formula cards, and previous year question papers. For competitive exam batches, we also provide daily practice problem (DPP) sheets and topic-wise question banks.', sortOrder: 3, isActive: true },
        { question: 'Do you offer online classes?', answer: 'Our primary mode is offline (in-person) coaching at our centre in Talegaon Dighe, Tal. Sangamner. However, for genuine cases where a student cannot attend in person, we may arrange online sessions. Please speak with us directly to understand the options.', sortOrder: 4, isActive: true },
        { question: 'How do parents track their child\'s progress?', answer: 'We send monthly progress reports to parents via WhatsApp, including test scores, attendance, and a personal note from Dr. Sarthak. Enrolled students also have access to a digital dashboard where they can view their test scores, daily quiz performance, and chapter progress. We welcome parents to schedule a direct meeting with Dr. Sarthak at any time.', sortOrder: 5, isActive: true },
      ],
    });
    console.log('✅ FAQs seeded');
  }

  // ── 10. Gallery ─────────────────────────────────────────────────────────────
  // Gallery is left empty by default to only show admin-uploaded images.
  console.log('✅ Gallery entries skipped (managed via Admin Panel)');

  console.log('\n🎉 Database seeding complete!');
  console.log('─────────────────────────────────────────────────────────────────');
  console.log('Admin Login → Mobile: 9665269059 | Password: trimitra@2026');
  console.log('Alt Login  → Mobile: 9999000000  | Password: trimitra@2026');
  console.log('─────────────────────────────────────────────────────────────────');
  console.log('Courses seeded: Foundation, 10th Board, 11-12 Science, Competitive');
  console.log('Syllabus seeded: 4 courses × chapters based on official references');
  console.log('Settings: WhatsApp 9665269059 | Address: 2nd Floor, Talegaon Dighe');
  console.log('─────────────────────────────────────────────────────────────────');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
