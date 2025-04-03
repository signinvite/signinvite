import { Outlet } from 'react-router';

import backgroundPattern from '@documenso/assets/images/background-pattern.png';
import { FaGithub } from 'react-icons/fa6';
import { env } from '@documenso/lib/utils/env';

export default function Layout() {
  return (
    <>
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-4 rounded-lg shadow-md mb-2">
        <h2 className="text-lg font-semibold mb-1">⚠ Important Notice</h2>
        <ul className="list-disc list-inside space-y-1 text-sm font-light">
          <li >The source code for this service is available (
            <a href={env("NEXT_PUBLIC_GITHUB_SHOW_URL")} target='_blank' className='hover:text-black' ><FaGithub className='inline' /></a>) to all users under the AGPL v3.</li>
          <li>This service is licensed under the GNU Affero General Public License v3 - <a href={env("NEXT_PUBLIC_GITHUB_SHOW_URL") + '?tab=AGPL-3.0-1-ov-file#readme'} target='_blank' className='hover:text-black' ><FaGithub className='inline' /></a>.</li>
          <li>&copy; and licensing notices are included in the source code and can be viewed in the 'README.md' file on <a href={env("NEXT_PUBLIC_GITHUB_SHOW_URL") + '?tab=readme-ov-file#readme'} target='_blank' className='hover:text-black' ><FaGithub className='inline' /></a></li>
          <li>We impose no additional restrictions beyond the terms of the <strong>AGPL v3.</strong></li>
          <li>This service remains fully open-source and is not proprietary.</li>
          <li>Original &copy; for Documenso is held by its contributors. Our modifications are licensed under AGPL v3.</li>
        </ul>
      </div>
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12 md:p-12 lg:p-24">

        <div>
          <div className="absolute -inset-[min(600px,max(400px,60vw))] -z-[1] flex items-center justify-center opacity-70">
            <img
              src={backgroundPattern}
              alt="background pattern"
              className="dark:brightness-95 dark:contrast-[70%] dark:invert dark:sepia"
              style={{
                mask: 'radial-gradient(rgba(255, 255, 255, 1) 0%, transparent 80%)',
                WebkitMask: 'radial-gradient(rgba(255, 255, 255, 1) 0%, transparent 80%)',
              }}
            />
          </div>


          <div className="relative w-full">
            <Outlet />
          </div>
        </div>
      </main>
    </>

  );
}
