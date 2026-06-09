import re

with open("src/app/[lang]/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Hero CTAs
hero_ctas_old = """              <div className="flex flex-wrap gap-3 mb-10">
                <a href="#demo-form" className="flex items-center gap-2 px-6 py-3.5 bg-brand-amber hover:bg-amber-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-amber-500/30 hover:scale-105">
                  <CalendarCheck size={18} />
                  {lang === 'mr' ? 'मोफत डेमो वर्ग बुक करा' : 'Book Free Demo Class'}
                </a>
                <a href="#courses" className="flex items-center gap-2 px-6 py-3.5 border-2 border-white/20 text-white font-semibold rounded-xl hover:border-brand-green hover:text-brand-green transition-all">
                  {lang === 'mr' ? 'अभ्यासक्रम पहा' : 'View Courses'}
                  <ChevronRight size={16} />
                </a>
              </div>"""

hero_ctas_new = """              <div className="flex flex-wrap gap-3 mb-10">
                <a href="#demo-form" className="flex items-center gap-2 px-5 py-3 bg-brand-amber hover:bg-amber-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-amber-500/30 hover:scale-105">
                  <CalendarCheck size={18} />
                  {lang === 'mr' ? 'मोफत डेमो' : 'Book Free Demo'}
                </a>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-lg shadow-green-500/30 transition-all hover:scale-105">
                  <MessageCircle size={18} />
                  WhatsApp
                </a>
                <a href={`tel:+91${phone}`} className="flex items-center gap-2 px-5 py-3 border border-white/20 hover:bg-white/10 text-white font-semibold rounded-xl transition-all">
                  <Phone size={18} />
                  Call Now
                </a>
              </div>"""
content = content.replace(hero_ctas_old, hero_ctas_new)

# 2. Courses Fallback
courses_old = """          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {dbCourses.length === 0 ? (
              <div className="col-span-full text-center py-10 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-slate-400">
                  {lang === 'mr' ? 'सध्या कोणतेही अभ्यासक्रम उपलब्ध नाहीत.' : 'No courses available at the moment.'}
                </p>
              </div>
            ) : dbCourses.map((course, idx) => {"""

courses_new = """          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(dbCourses.length > 0 ? dbCourses : [
              { id: 'f1', title: 'Foundation (6th-8th)', subtitle: 'Build Strong Basics', description: 'Perfect starting point for academic excellence and conceptual clarity.', subjects: 'Maths,Science,English', targetTrack: 'FOUNDATION_6_9' },
              { id: 'f2', title: '9th-10th Board Mastery', subtitle: 'Target 95%+', description: 'Comprehensive preparation for SSC & CBSE board exams.', subjects: 'Maths,Science,Social,English', targetTrack: 'BOARD_10' },
              { id: 'f3', title: '11th-12th Science', subtitle: 'HSC / CBSE', description: 'Expert coaching for Board exams with practical insights.', subjects: 'Physics,Chemistry,Maths,Biology', targetTrack: 'SCIENCE_11_12' },
              { id: 'f4', title: 'JEE & NEET', subtitle: 'Competitive Focus', description: 'Rigorous preparation for top-tier engineering and medical colleges.', subjects: 'Physics,Chemistry,Maths,Biology', targetTrack: 'COMPETITIVE' },
            ]).map((course: any, idx) => {"""
content = content.replace(courses_old, courses_new)

# 3. Teaching Methodology & First Batch Journey (Trust Building)
# We will insert this right after WHY TRIMITRA
why_section_end = """          </div>
        </div>
      </section>"""

trust_sections = """          </div>
        </div>
      </section>

      {/* ── 3.5. TEACHING METHODOLOGY ──────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#091c38] to-[#0F2E5A]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-brand-green text-sm font-semibold uppercase tracking-wider mb-2">
            {lang === 'mr' ? 'आमची शिकवण्याची पद्धत' : 'How We Teach'}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
            {lang === 'mr' ? 'यशाचा स्पष्ट मार्ग' : 'The Trimitra Academic Roadmap'}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-20 right-20 h-0.5 bg-gradient-to-r from-transparent via-brand-green/30 to-transparent"></div>
            
            {[
              { step: '01', title: 'Concept Building', desc: 'We start from zero. No rushing, no memorizing without understanding.', icon: Lightbulb },
              { step: '02', title: 'Rigorous Practice', desc: 'Daily assignments and structured problem-solving sessions.', icon: Target },
              { step: '03', title: 'Exam Readiness', desc: 'Weekly pattern-based tests and performance analysis.', icon: Trophy }
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="relative z-10 flex flex-col items-center">
                  <div className="w-24 h-24 bg-[#091c38] border-4 border-[#0F2E5A] rounded-full flex items-center justify-center mb-6 shadow-2xl relative">
                    <div className="absolute -inset-1 bg-gradient-to-br from-brand-green to-brand-amber rounded-full opacity-20 animate-pulse"></div>
                    <Icon size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3"><span className="text-brand-green mr-2">{s.step}.</span>{s.title}</h3>
                  <p className="text-slate-400 text-sm max-w-xs leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>"""
content = content.replace(why_section_end, trust_sections, 1)

# 4. Results Section (Our First Batch Journey fallback)
results_old = """          {dbResults.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
              {dbResults.map((r) => (
                <div key={r.id} className={`border rounded-2xl p-5 flex items-center gap-4 ${RESULT_COLORS[r.track] || 'border-white/20 bg-white/3'}`}>
                  <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <Trophy size={24} className="text-brand-amber" />
                  </div>
                  <div>
                    <p className="text-white font-bold">{r.studentName}</p>
                    <p className="text-slate-400 text-sm">{r.examName} · {r.examYear}</p>
                    <p className="text-brand-green font-bold text-lg">{r.score}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500 mb-14">
              <p>Results coming soon. <a href="#demo-form" className="text-brand-green hover:underline">Be the next success story →</a></p>
            </div>
          )}"""

results_new = """          {dbResults.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
              {dbResults.map((r) => (
                <div key={r.id} className={`border rounded-2xl p-5 flex items-center gap-4 ${RESULT_COLORS[r.track] || 'border-white/20 bg-white/3'}`}>
                  <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <Trophy size={24} className="text-brand-amber" />
                  </div>
                  <div>
                    <p className="text-white font-bold">{r.studentName}</p>
                    <p className="text-slate-400 text-sm">{r.examName} · {r.examYear}</p>
                    <p className="text-brand-green font-bold text-lg">{r.score}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-r from-brand-amber/10 to-brand-green/10 border border-white/10 rounded-2xl p-8 md:p-12 text-center mb-14 max-w-4xl mx-auto">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star size={32} className="text-brand-amber fill-brand-amber" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Be Part of Our Founding Batch</h3>
              <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                Trimitra Coaching Centre is building a legacy from the ground up. Join our very first batch of focused, driven students. You won't just be a number here — you will be the foundation of our success story.
              </p>
              <a href="#demo-form" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-bold rounded-xl transition-all hover:bg-slate-200">
                Join the First Batch <ArrowRight size={18} />
              </a>
            </div>
          )}"""
content = content.replace(results_old, results_new)

# 5. Gallery Section Fallback and Image tags
gallery_old = """      {/* ── 6. GALLERY ──────────────────────────────────────────────── */}
      {dbGallery.length > 0 && (
        <section id="gallery" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#091c38]">"""

gallery_new = """      {/* ── 6. GALLERY ──────────────────────────────────────────────── */}
      {(dbGallery.length > 0 || true) && (
        <section id="gallery" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#091c38]">"""
content = content.replace(gallery_old, gallery_new)

gallery_map_old = """            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dbGallery.slice(0, 6).map((item) => (
                <div key={item.id} className="relative h-56 rounded-2xl overflow-hidden border border-white/10 group">
                  <img
                    src={item.imageUrl}
                    alt={item.altText || item.caption || 'Trimitra Coaching Centre'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {item.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>"""

gallery_map_new = """            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(dbGallery.length > 0 ? dbGallery.slice(0, 6) : [
                { id: 'g1', imageUrl: '/hero-classroom.jpg', caption: 'Interactive Classroom Sessions', altText: 'Classroom' },
                { id: 'g2', imageUrl: '/hero-classroom.jpg', caption: 'Focused Doubt Solving', altText: 'Doubt Solving' },
                { id: 'g3', imageUrl: '/hero-classroom.jpg', caption: 'Modern Infrastructure', altText: 'Infrastructure' }
              ]).map((item: any) => (
                <div key={item.id} className="relative h-56 rounded-2xl overflow-hidden border border-white/10 group">
                  <Image
                    src={item.imageUrl}
                    alt={item.altText || item.caption || 'Trimitra Coaching Centre'}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {item.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>"""
content = content.replace(gallery_map_old, gallery_map_new)

with open("src/app/[lang]/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
