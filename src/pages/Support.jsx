import { GraduationCap, Users, Mail } from 'lucide-react';

const team = [
  { 
    name: "Youssef Tarek Mohammed", 
    id: "971221408",
    links: { linkedin: "https://www.linkedin.com/in/youssef-tarek-388bba255/?skipRedirect=true" }
  },
  { 
    name: "Khalid Samy Abd-Elzaher", 
    id: "971221103",
    links: {
      linkedin: "https://www.linkedin.com/in/khalid-samy/",
      github: "https://github.com/khalidsamy",
      portfolio: "https://khalid-samy.vercel.app/"
    }
  },
  { name: "Mahmoud Ahmed saad", id: "971221304" },
  { 
    name: "Hesham Amr Mohammed", 
    id: "971221386",
    links: { linkedin: "https://www.linkedin.com/in/hesham-pebrs/" }
  },
  { name: "Mariam Hossam", id: "971221320" },
  { name: "Nada Mohamed", id: "971221366" }
];

export default function Support() {
  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16 px-4 md:px-8 transition-all duration-300 antialiased">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-16 md:mb-20">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Development Team <span className="text-emerald-600">&</span> Support
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg font-medium">
            Elevating indoor spaces through premium botanical experiences. 
            A Helwan National University Graduation Project.
          </p>
        </div>

        {/* ACADEMIC CONTEXT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 md:p-12 text-slate-900 border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-3 text-emerald-600 font-bold uppercase tracking-widest text-xs mb-6">
                <GraduationCap size={20} /> Academic Context
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-8">Helwan National University</h2>
              <div className="space-y-4 text-slate-600 font-medium text-sm md:text-base">
                <p className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Faculty of Humanities, Commerce, and Business Administration</p>
                <p className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> BIDT Graduation Project (Year 2026)</p>
                <p className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Project No. 15</p>
              </div>
            </div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-50 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 text-emerald-600 font-bold uppercase tracking-widest text-xs mb-8">
              <Users size={20} /> Supervisors
            </div>
            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">IT Section</p>
                <p className="text-xl font-bold text-slate-900 ">Dr. Shimaa Ouf</p>
              </div>
              <div className="pt-6 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Business Section</p>
                <p className="text-xl font-bold text-slate-900 ">Dr. Rasha Al-Kurdi</p>
              </div>
            </div>
          </div>
        </div>

        {/* TEAM GRID */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-2">Development Team</h3>
            <p className="text-emerald-600 font-bold uppercase tracking-widest text-[10px]">Project Implementation Experts</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member) => (
              <div 
                key={member.id} 
                className="bg-white rounded-2xl p-8 flex flex-col items-center text-center shadow-sm border border-slate-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/50 relative overflow-hidden group"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl font-bold mb-6 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-500">
                  {member.name[0]}
                </div>
                
                <h4 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h4>
                <p className="text-sm font-medium text-emerald-600/80 mb-6 bg-emerald-50 px-3 py-1 rounded-full">ID: {member.id}</p>
                
                <div className="flex gap-4 mt-auto pt-6 border-t border-slate-100 w-full justify-center">
                  {member.links?.linkedin && (
                    <a 
                      href={member.links.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-[#0077b5] hover:bg-white transition-all active:scale-90"
                      title="LinkedIn Profile"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    </a>
                  )}
                  {member.links?.github && (
                    <a 
                      href={member.links.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all active:scale-90"
                      title="GitHub Profile"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    </a>
                  )}
                  {member.links?.portfolio && (
                    <a 
                      href={member.links.portfolio} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-white transition-all active:scale-90"
                      title="Portfolio Website"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONTACT SECTION */}
        <div className="bg-white rounded-2xl p-10 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h4 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              <Mail className="text-emerald-600" size={24} /> Need direct support?
            </h4>
            <p className="text-slate-600 font-medium">Our team is available to answer any questions regarding the graduation project.</p>
          </div>
          <a href="mailto:support@greenify.com" className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95 cursor-pointer">
            support@greenify.com
          </a>
        </div>
      </div>
    </div>
  );
}
