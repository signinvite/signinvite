import { Trans } from '@lingui/react/macro';
import { Mail } from 'lucide-react';

import { SendConfirmationEmailForm } from '~/components/forms/send-confirmation-email';

export default function UnverifiedAccount() {
  return (
    <div className="w-screen max-w-lg px-4">
      <div className="flex items-start">
        <div className="mr-4 mt-1 hidden md:block">
          <Mail className="text-primary h-10 w-10" strokeWidth={2} />
        </div>
        <div className="">
          <h2 className="text-2xl font-bold md:text-4xl">
            <Trans>Confirm email Sent</Trans>
          </h2>

          <p className="text-muted-foreground mt-4">
            <Trans>
              To gain access to your account, please confirm your email address by clicking on the
              confirmation link from your inbox.
            </Trans>
          </p>

          <p className="text-muted-foreground mt-4">
            <Trans>
              <div className="font-extrabolds text-xl dark:text-white">
                If you don't find the confirmation link in your inbox, you can request a new one
                below.
              </div>
            </Trans>
          </p>

          <SendConfirmationEmailForm />
        </div>
      </div>
    </div>
  );
}
