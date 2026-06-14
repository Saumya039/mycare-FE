const fs = require('fs');
const path = require('path');

const routes = [
  'opd', 'ipd', 'pharmacy', 'pathology', 'radiology', 'front-office', 
  'records', 'branches', 'hr', 'attendance', 'roster', 'calendar', 
  'referral', 'tpa', 'finance', 'messaging', 'downloads', 'certificates', 
  'consultation', 'reports'
];

routes.forEach(route => {
  const dir = path.join(__dirname, 'src', 'app', route);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const title = route.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const content = `
import { Activity } from "lucide-react"

export default function ${title.replace(' ', '')}Page() {
  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-cyan-500/10 text-cyan-500 rounded-2xl">
          <Activity className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">${title} Module</h1>
          <p className="text-slate-500">Enterprise System Workspace</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
        <Activity className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Under Construction</h2>
        <p className="text-slate-500 mt-2 max-w-md">This module is currently being built in Phase 2/3 of the implementation plan. Check back soon!</p>
      </div>
    </div>
  )
}
`;

  fs.writeFileSync(path.join(dir, 'page.tsx'), content);
  console.log(`Created route: /${route}`);
});
