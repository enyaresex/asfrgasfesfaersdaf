import React, { useContext, useMemo } from 'react';
import { useIntl } from 'react-intl';
import useSWR from 'swr';
import { AuthAndApiContext } from '../../contexts';
import PageHeader from '../PageHeader';
import ShareButton from '../ShareButton';
import background from './background.jpg';
import styles from './DuelHeader.module.css';

type Content = {
  description?: string,
  title: string,
};

type Props = {
  duel: HydratedDuel,
};

type DuelStep = 'canceled'
  | 'checkedInUser1'
  | 'checkedInUser2'
  | 'checkingInDuelUser1'
  | 'checkingInDuelUser2'
  | 'declined'
  | 'defaultCheckInDuel'
  | 'defaultInvitedDuel'
  | 'defaultOpenDuel'
  | 'defaultResultDeclaration'
  | 'ended'
  | 'expired'
  | 'inDispute'
  | 'inProgress'
  | 'invitedDuelUser1'
  | 'invitedDuelUser2'
  | 'noDeclaredResultByUsers'
  | 'openDuelUser1'
  | 'resultDeclarationResponsePending'
  | 'resultDeclared';

export default function DuelHeader({ duel }: Props) {
  const intl = useIntl();
  const { user } = useContext(AuthAndApiContext);
  const { data: user1 } = useSWR<User>(`/users/${duel.user1}/`);
  const { data: user2 } = useSWR<User>(duel.user2 === null ? null : `/users/${duel.user2}/`);
  const { data: resultDeclarations } = useSWR<ResultDeclaration[]>(`/duels/result_declarations/?duel=${duel.id}`);
  const { data: gameMode } = useSWR<GameMode>(`/games/game_modes/${duel.gameMode}/`);
  const { data: game } = useSWR<Game>(gameMode === undefined ? null : `/games/${gameMode.game}/`);
  const { data: userWon } = useSWR<User>(duel.userWon === null ? null : `/users/${duel.userWon}/`);
  const lastDeclaration = useMemo<ResultDeclaration | null>(() => (
    (resultDeclarations === undefined || resultDeclarations.length === 0)
      ? null
      : resultDeclarations[resultDeclarations.length - 1]),
  [resultDeclarations]);

  const isAuthUser1User = useMemo<boolean>(() => user1 !== undefined && user !== null && user.id === user1.id,
    [user, user1]);
  const isAuthUser2User = useMemo<boolean>(() => user2 !== undefined && user !== null && user.id === user2.id,
    [user, user2]);
  const userNotRelated = useMemo<boolean>(() => user === null || (!isAuthUser1User && !isAuthUser2User), [user]);

  const resultDeclaredByAuthUser = useMemo<boolean | null>(() => {
    if (lastDeclaration === null || user === null) return null;

    return lastDeclaration.user1 === user.id;
  }, [lastDeclaration, user]);

  const resultDeclarationResponseByAuthUser = useMemo<boolean | null>(() => {
    if (lastDeclaration === null || user === null) return null;

    return lastDeclaration.user2 === user.id;
  }, [lastDeclaration, user]);

  const conditions = useMemo<Record<DuelStep, boolean>>(() => ({
    canceled: duel.status === 'CANCELED',
    checkedInUser1: duel.status === 'CHECKING_IN' && isAuthUser1User && duel.user1CheckedInAt !== null,
    checkedInUser2: duel.status === 'CHECKING_IN' && isAuthUser2User && duel.user2CheckedInAt !== null,
    checkingInDuelUser1: duel.status === 'CHECKING_IN' && isAuthUser1User && duel.user1CheckedInAt === null,
    checkingInDuelUser2: duel.status === 'CHECKING_IN' && isAuthUser2User && duel.user2CheckedInAt === null,
    declined: duel.status === 'DECLINED',
    defaultCheckInDuel: duel.status === 'CHECKING_IN' && userNotRelated,
    defaultInvitedDuel: duel.status === 'INVITED' && userNotRelated,
    defaultOpenDuel: duel.status === 'OPEN' && userNotRelated, /* Should act different if user is authenticated or not */
    defaultResultDeclaration: userNotRelated && duel.status === 'DECLARING_RESULT',
    ended: duel.status === 'ENDED',
    expired: duel.status === 'EXPIRED',
    inDispute: duel.status === 'IN_DISPUTE',
    inProgress: duel.status === 'IN_PROGRESS',
    invitedDuelUser1: duel.status === 'INVITED' && isAuthUser1User,
    invitedDuelUser2: duel.status === 'INVITED' && isAuthUser2User,
    noDeclaredResultByUsers: duel.status === 'DECLARING_RESULT' && (resultDeclarations === undefined || resultDeclarations.length === 0) && (isAuthUser1User || isAuthUser2User),
    openDuelUser1: duel.status === 'OPEN' && isAuthUser1User,
    resultDeclarationResponsePending: duel.status === 'DECLARING_RESULT' && resultDeclarationResponseByAuthUser !== null && resultDeclarationResponseByAuthUser
      && lastDeclaration !== null && lastDeclaration.isAccepted === null,
    resultDeclared: duel.status === 'DECLARING_RESULT' && resultDeclaredByAuthUser !== null && resultDeclaredByAuthUser
      && lastDeclaration !== null && lastDeclaration.isAccepted === null,
  }), [duel, user, user1, user2]);

  const content = useMemo<Record<DuelStep, Content>>(() => ({
    canceled: {
      title: intl.formatMessage({ defaultMessage: 'Duel Has Canceled' }),
    },
    checkedInUser1: {
      description: intl.formatMessage({ defaultMessage: 'The match will start when the both sides are ready.' }),
      title: intl.formatMessage({ defaultMessage: 'Waiting For Opponent' }),
    },
    checkedInUser2: {
      description: intl.formatMessage({ defaultMessage: 'The match will start when the both sides are ready.' }),
      title: intl.formatMessage({ defaultMessage: 'Waiting For Opponent' }),
    },
    checkingInDuelUser1: {
      description: intl.formatMessage({ defaultMessage: 'The match will start when the both sides are ready.' }),
      title: intl.formatMessage({ defaultMessage: 'Opponent is Ready' }),
    },
    checkingInDuelUser2: {
      description: intl.formatMessage({ defaultMessage: 'The match will start when the both sides are ready.' }),
      title: intl.formatMessage({ defaultMessage: 'Opponent is Ready' }),
    },
    declined: {
      description: intl.formatMessage({ defaultMessage: 'The duel is declined.' }),
      title: intl.formatMessage({ defaultMessage: 'Duel Has Declined' }),
    },
    defaultCheckInDuel: {
      description: intl.formatMessage({ defaultMessage: 'The match will start when the both sides are ready.' }),
      title: intl.formatMessage({ defaultMessage: 'Waiting for Opponents to be Ready' }),
    },
    defaultInvitedDuel: {
      description: intl.formatMessage({ defaultMessage: 'The match will start when the both sides are ready.' }),
      title: intl.formatMessage({ defaultMessage: 'Waiting for Opponent' }),
    },
    defaultOpenDuel: {
      description: intl.formatMessage({ defaultMessage: 'You can accept the challenge and join duel.' }),
      title: intl.formatMessage({ defaultMessage: 'Join Duel' }),
    },
    defaultResultDeclaration: {
      description: intl.formatMessage({ defaultMessage: 'Opponents need to declare the result to end the duel.' }),
      title: intl.formatMessage({ defaultMessage: 'Result Declaration' }),
    },
    ended: {
      description: userWon === undefined
        ? intl.formatMessage({ defaultMessage: 'Both sides declared the result successfully.' })
        : intl.formatMessage({ defaultMessage: '{user} won the duel.' }, {
          user: userWon.username,
        }),
      title: intl.formatMessage({ defaultMessage: 'Duel Has Ended' }),
    },
    expired: {
      description: intl.formatMessage({ defaultMessage: 'The duel is expired.' }),
      title: intl.formatMessage({ defaultMessage: 'Duel Has Expired' }),
    },
    inDispute: {
      description: intl.formatMessage({ defaultMessage: 'Opponents declined the result.' }),
      title: intl.formatMessage({ defaultMessage: 'Duel Results Disputed' }),
    },
    inProgress: {
      description: intl.formatMessage({ defaultMessage: 'Both sides are playing the match right now.' }),
      title: intl.formatMessage({ defaultMessage: 'Playing Now' }),
    },
    invitedDuelUser1: {
      description: intl.formatMessage({ defaultMessage: 'You’ve created a new duel successfully.' }),
      title: intl.formatMessage({ defaultMessage: 'Created A Duel' }),
    },
    invitedDuelUser2: {
      description: intl.formatMessage({ defaultMessage: 'A new opponent wants to duel with you.' }),
      title: intl.formatMessage({ defaultMessage: 'A New Opponent' }),
    },
    noDeclaredResultByUsers: {
      description: intl.formatMessage({ defaultMessage: 'Opponents need to declare the result to end the duel.' }),
      title: intl.formatMessage({ defaultMessage: 'Result Declaration' }),
    },
    openDuelUser1: {
      description: intl.formatMessage({ defaultMessage: 'You’ve created a new duel successfully.' }),
      title: intl.formatMessage({ defaultMessage: 'Created A Duel' }),
    },
    resultDeclarationResponsePending: {
      description: intl.formatMessage({ defaultMessage: 'Please give response to declared result.' }),
      title: intl.formatMessage({ defaultMessage: 'Result Declared' }),
    },
    resultDeclared: {
      description: intl.formatMessage({ defaultMessage: 'Waiting for opponent respond in 1 hour.' }),
      title: intl.formatMessage({ defaultMessage: 'Result Declared' }),
    },
  }), []);

  const display = useMemo<Content | null>(() => {
    const temp = (Object.keys(conditions) as DuelStep[]).find((key) => conditions[key]);

    return temp === undefined ? null : content[temp];
  }, [conditions, userWon]);

  return (
    <>
      <PageHeader
        background={game === undefined ? background.src : game.image}
        className={styles.duelHeader}
        description={display === null ? '' : display.description}
        title={(
          <div className={styles.title}>
            {display === null ? '' : display.title}

            {game !== undefined && (
              <ShareButton
                text={intl.formatMessage(
                  { defaultMessage: 'Challenge me! | {game} | Gamer Arena Competitive Esports Platform' },
                  { game: game.name },
                )}
              />
            )}
          </div>
        )}
      />
    </>
  );
}
