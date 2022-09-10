import classNames from 'classnames';
import React, { Fragment, useContext, useEffect, useMemo, useState } from 'react';
import AnimateHeight from 'react-animate-height';
import { FormattedMessage, useIntl } from 'react-intl';
import useSWR from 'swr';
import { AuthAndApiContext, BreakpointContext } from '../../contexts';
import { ReactComponent as AwaitingOpponent } from './awaitingOpponent.svg';
import { ReactComponent as AwaitingComponentMuted } from './awaitingOpponentMuted.svg';
import { ReactComponent as AwaitingReadyCheck } from './awaitingReadyCheck.svg';
import { ReactComponent as AwaitingReadyCheckMuted } from './awaitingReadyCheckMuted.svg';
import { ReactComponent as AwaitingResponse } from './awaitingResponse.svg';
import { ReactComponent as AwaitingResponseMuted } from './awaitingResponseMuted.svg';
import { ReactComponent as Check } from './check.svg';
import { ReactComponent as Current } from './current.svg';
import styles from './DuelProgress.module.css';
import { ReactComponent as Ended } from './ended.svg';
import { ReactComponent as EndedMuted } from './endedMuted.svg';
import { ReactComponent as InProgress } from './inProgress.svg';
import { ReactComponent as InProgressMuted } from './inProgressMuted.svg';
import { ReactComponent as Plus } from './plus.svg';
import { ReactComponent as ResultDeclarationIcon } from './resultDeclaration.svg';
import { ReactComponent as ResultDeclarationMuted } from './resultDeclarationMuted.svg';
import { ReactComponent as ResultDeclarationResponse } from './resultDeclarationResponse.svg';
import { ReactComponent as ResultDeclarationResponseMuted } from './resultDeclarationResponseMuted.svg';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['section']>, {
  duel: HydratedDuel,
}>;

type Step =
  'awaitingOpponent'
  | 'awaitingResponse'
  | 'awaitingReadyCheck'
  | 'inProgress'
  | 'resultDeclaration'
  | 'resultDeclarationResponse'
  | 'ended';

type StepDetail = {
  text: string,
  step: number | null,
  icon: React.ReactNode
  mutedIcon: React.ReactNode
};

export default function DuelProgress({ className, duel, ...props }: Props) {
  const intl = useIntl();
  const { user } = useContext(AuthAndApiContext);
  const { device } = useContext(BreakpointContext);

  const [collapsed, setCollapsed] = useState<boolean>(device !== 'desktop');
  const [currentStep, setCurrentStep] = useState<Step | null>(null);

  const { data: resultDeclarations } = useSWR<ResultDeclaration[]>(`/duels/result_declarations/?duel=${duel.id}`);

  const lastDeclaration = useMemo<ResultDeclaration | null>(() => (
    (resultDeclarations === undefined || resultDeclarations.length === 0)
      ? null
      : resultDeclarations[resultDeclarations.length - 1]),
  [resultDeclarations]);

  useEffect(() => {
    if (duel.status === 'OPEN') setCurrentStep('awaitingOpponent');

    if ((duel.status === 'CHECKING_IN' && duel.user2CheckedInAt === null) || duel.status === 'INVITED') {
      setCurrentStep(
        'awaitingResponse',
      );
    }

    if (duel.status === 'CHECKING_IN' && duel.user2CheckedInAt !== null) setCurrentStep('awaitingReadyCheck');

    if (duel.status === 'IN_PROGRESS') setCurrentStep('inProgress');

    if (duel.status === 'DECLARING_RESULT' && user === null) setCurrentStep('resultDeclaration');

    if (duel.status === 'DECLARING_RESULT' && user !== null && lastDeclaration === null) {
      setCurrentStep(
        'resultDeclaration',
      );
    }

    if (duel.status === 'DECLARING_RESULT' && user !== null && lastDeclaration !== null && lastDeclaration.isAccepted !== true) {
      setCurrentStep('resultDeclarationResponse');
    }

    if (duel.status === 'CANCELED' || duel.status === 'DECLINED' || duel.status === 'ENDED' || duel.status === 'EXPIRED') {
      setCurrentStep('ended');
    }
  }, [duel, lastDeclaration, user]);

  const steps = useMemo<Record<Step, StepDetail>>(() => ({
    awaitingOpponent: {
      step: 1,
      text: intl.formatMessage({ defaultMessage: 'Awaiting opponent' }),
      icon: <AwaitingOpponent />,
      mutedIcon: <AwaitingComponentMuted />,
    },
    awaitingResponse: {
      step: 2,
      text: intl.formatMessage({ defaultMessage: 'Awaiting response' }),
      icon: <AwaitingResponse />,
      mutedIcon: <AwaitingResponseMuted />,
    },
    awaitingReadyCheck: {
      step: 3,
      text: intl.formatMessage({ defaultMessage: 'Awaiting ready check' }),
      icon: <AwaitingReadyCheck />,
      mutedIcon: <AwaitingReadyCheckMuted />,
    },
    inProgress: {
      step: 4,
      text: intl.formatMessage({ defaultMessage: 'Add each other in-game and play!' }),
      icon: <InProgress />,
      mutedIcon: <InProgressMuted />,
    },
    resultDeclaration: {
      step: 5,
      text: intl.formatMessage({ defaultMessage: 'Awaiting result declaration' }),
      icon: <ResultDeclarationIcon />,
      mutedIcon: <ResultDeclarationMuted />,
    },
    resultDeclarationResponse: {
      step: 6,
      text: intl.formatMessage({ defaultMessage: 'Awaiting result declaration response' }),
      icon: <ResultDeclarationResponse />,
      mutedIcon: <ResultDeclarationResponseMuted />,
    },
    ended: {
      step: null,
      text: intl.formatMessage({ defaultMessage: 'Duel has ended' }),
      icon: <Ended />,
      mutedIcon: <EndedMuted />,
    },
  }), []);

  const numberOfSteps = useMemo(() => Object.keys(steps).length - 1, [steps]);

  return currentStep === null ? null : (
    <section {...props} className={classNames(styles.duelProgress, className)}>
      <button
        className={classNames(styles.header, !collapsed && styles.opened)}
        onClick={() => setCollapsed((prev) => (!prev))}
        type="button"
      >
        {device === 'desktop' ? (
          <>
            <p>
              <FormattedMessage defaultMessage="Duel Process" />
            </p>

            <Plus />
          </>
        ) : (
          <div className={styles.step}>
            <div className={styles.detail}>
              {steps[currentStep].icon}

              <p>{steps[currentStep].text}</p>
            </div>

            {steps[currentStep].step === null ? null : (
              <p>
                {`${steps[currentStep].step}/${numberOfSteps} `}
                <FormattedMessage defaultMessage="Steps" />
              </p>
            )}
          </div>
        )}
      </button>

      <AnimateHeight
        duration={150}
        height={collapsed ? 0 : 'auto'}
      >
        <div className={styles.content}>
          <div className={styles.wrapper}>
            {(Object.keys(steps) as Step[]).map((key, index) => (
              <Fragment key={key}>
                <div
                  className={classNames(
                    styles.step,
                    currentStep === key && styles.current,
                    (steps[currentStep].step !== null && Number(steps[currentStep].step) < index + 1 && styles.muted),
                    key === 'ended' && styles.ended,
                  )}
                >
                  <div className={styles.detail}>
                    {key === currentStep && steps[key].icon}

                    {key !== currentStep
                    && ((steps[currentStep].step !== null && Number(steps[currentStep].step) < index + 1)
                      ? steps[key].mutedIcon
                      : <Check />)}

                    <p>{steps[key].text}</p>
                  </div>

                  {steps[key].step !== null && (
                    <p>
                      {`${steps[key].step}/${numberOfSteps} `}
                      <FormattedMessage defaultMessage="Steps" />
                    </p>
                  )}
                </div>

                {(numberOfSteps > index + 1) && <div className={styles.line} />}
              </Fragment>
            ))}
          </div>
        </div>
      </AnimateHeight>

      <button
        className={classNames(styles.toggle, collapsed && styles.collapsed)}
        onClick={() => setCollapsed((prev) => !prev)}
        type="button"
      >
        <Current />
      </button>
    </section>
  );
}
