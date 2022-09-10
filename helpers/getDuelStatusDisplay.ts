const duelStatusDisplays: Record<DuelStatus, DuelHydratedStatus> = {
  CANCELED: 'Canceled',
  CHECKING_IN: 'Checking In',
  DECLARING_RESULT: 'Declaring Result',
  DECLINED: 'Declined',
  ENDED: 'Ended',
  EXPIRED: 'Expired',
  INVITED: 'Invited',
  IN_DISPUTE: 'In Dispute',
  IN_PROGRESS: 'In Progress',
  OPEN: 'Open',
};

export default function getDuelStatusDisplay(status: DuelStatus): DuelHydratedStatus {
  return duelStatusDisplays[status];
}
