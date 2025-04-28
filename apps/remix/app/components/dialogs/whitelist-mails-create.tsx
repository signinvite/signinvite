import { useState } from 'react';

import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import { FilePlus } from 'lucide-react';
import { useNavigate } from 'react-router';

import { useSession } from '@documenso/lib/client-only/providers/session';
import { trpc } from '@documenso/trpc/react';
import { Button } from '@documenso/ui/primitives/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@documenso/ui/primitives/dialog';
import { Input } from '@documenso/ui/primitives/input';
import { useToast } from '@documenso/ui/primitives/use-toast';

// type WhitelistEmailCreateDialogProps = {
//   teamId?: number;
//   templateRootPath: string;
// };

export const WhitelistEmailCreateDialog = () => {
  const navigate = useNavigate();

  const { user } = useSession();
  const { toast } = useToast();
  const { _ } = useLingui();

  const { mutateAsync: createTemplate } = trpc.admin.addWhitelistEmail.useMutation();

  const [showWhitelistEmailCreateDialog, setShowWhitelistEmailCreateDialog] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const [email, setEmail] = useState('');

  const sendMail = trpc.admin.addWhitelistEmail.useMutation();

  const handleSend = () => {
    if (!email) {
      toast({
        title: _(msg`Something went wrong`),
        description: _(msg`Please enter an email address.`),
        variant: 'destructive',
        duration: 7500,
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: _(msg`Something went wrong`),
        description: _(msg`Please enter a valid email address.`),
        variant: 'destructive',
        duration: 7500,
      });
      return;
    }

    sendMail.mutate(
      {
        email,
      },
      {
        onSuccess: () => {
          toast({
            title: _(msg`Add Email to Whitelist`),
            description: _(msg`The email has been successfully added to the whitelist.`),
            duration: 5000,
            variant: 'default',
          });
          setEmail('');

          setShowWhitelistEmailCreateDialog(false);
        },
        onError: (error) => {
          toast({
            title: _(msg`Something went wrong`),
            description: _(msg`he email could not be added at this time. Please try again later.`),
            variant: 'destructive',
            duration: 7500,
          });
        },
      },
    );
  };

  // const { mutateAsync: AddWhitelistEmail, isPending } = trpc.admin.addWhitelistEmail.useMutation({
  //   onSuccess: async () => {
  //     // void refreshLimits();

  //     toast({
  //       title: _(msg`Add Mail in Whitelist `),
  //       description: _(msg`Mail has been successfully Added in Whitelist`),
  //       duration: 5000,
  //     });

  //     // await onDelete?.();

  //     // onOpenChange(false);
  //   },
  //   onError: () => {
  //     toast({
  //       title: _(msg`Something went wrong`),
  //       description: _(msg`This document could not be deleted at this time. Please try again.`),
  //       variant: 'destructive',
  //       duration: 7500,
  //     });
  //   },
  // });

  return (
    <Dialog
      open={showWhitelistEmailCreateDialog}
      onOpenChange={(value) => !isUploadingFile && setShowWhitelistEmailCreateDialog(value)}
    >
      <DialogTrigger asChild>
        <Button className="cursor-pointer" disabled={!user.emailVerified}>
          <FilePlus className="-ml-1 mr-2 h-4 w-4" />
          <Trans>Add Mail</Trans>
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-xl">
        <DialogHeader>
          <DialogTitle>
            <Trans>Add Mail</Trans>
          </DialogTitle>
          {/* <DialogDescription>
            <Trans>
              Templates allow you to quickly generate documents with pre-filled recipients and
              fields.
            </Trans>
          </DialogDescription> */}
        </DialogHeader>

        <Input
          type="email"
          placeholder="Enter the Whitelist Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" disabled={isUploadingFile}>
              <Trans>Close</Trans>
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSend} variant="default">
            <Trans>Send</Trans>
          </Button>

          {/* <Button
            type="button"
            loading={isPending}
            onClick={(AddWhitelistEmail}
            // disabled={!isDeleteEnabled && canManageDocument}
            variant="default"
          >
             {canManageDocument ? _(msg`Delete`) : _(msg`Hide`)} 
            <Trans>Send</Trans>
          </Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
