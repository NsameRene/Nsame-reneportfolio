const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const listRegex = /activeTab === 'Quotes' \|\| activeTab === 'Gallery'/;
code = code.replace(listRegex, "activeTab === 'Quotes' || activeTab === 'Gallery' || activeTab === 'What I Do'");

const formBlock = `
                    {activeTab === 'What I Do' && (
                      <>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                          <input name="title" type="text" required defaultValue={editingItem?.title || ''} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-600 outline-none text-sm font-medium" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Icon (e.g. Globe, Terminal, Database, Cpu, Code)</label>
                          <input name="icon" type="text" required defaultValue={editingItem?.icon || 'Terminal'} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-600 outline-none text-sm font-medium" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Items (Comma separated, e.g. React, Next.js, Tailwind)</label>
                          <textarea name="items" rows={3} required defaultValue={editingItem?.items || ''} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-600 outline-none resize-none text-sm font-medium" placeholder="React, Node.js, TypeScript" />
                        </div>
                      </>
                    )}
`;

code = code.replace("{activeTab === 'Quotes' && (", formBlock.trim() + "\n                    {activeTab === 'Quotes' && (");

// When saving what I do, we will get the form data. Let's see how they are handled.
// Admin.tsx has a generic handleSave function.
// Let's check how handleSave is implemented.
fs.writeFileSync('src/pages/Admin.tsx', code);
