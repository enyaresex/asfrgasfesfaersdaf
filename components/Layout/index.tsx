import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { BreakpointContext } from '../../contexts';
import AnalyticsProvider from '../AnalyticsProvider';
import BackgroundShade from '../BackgroundShade';
import BottomNavbar from '../BottomNavbar';
import Footer from '../Footer';
import Header from '../Header';
import Sidebar from '../Sidebar';
import styles from './Layout.module.css';

type Props = Overwrite<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, {
  displayFooter?: boolean,
}>;

export default function Layout({ children, className, displayFooter = false, ...props }: Props) {
  const router = useRouter();
  const { device } = useContext(BreakpointContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const isSidebarStatic = device === 'desktop' && router.pathname !== '/';

  useEffect(() => {
    const bodyClassName = 'has-non-static-sidebar-open';

    if (!isSidebarStatic && isSidebarOpen) {
      document.body.classList.add(bodyClassName);
    } else {
      document.body.classList.remove(bodyClassName);
    }
  }, [isSidebarOpen, isSidebarStatic]);

  return (
    <div
      {...props}
      className={classNames(
        styles.layout,
        isSidebarStatic && 'layout-with-sidebar',
        isSidebarStatic && styles.withStaticSidebar,
        !displayFooter && styles.footerHidden,
        className,
      )}
    >
      {!isSidebarStatic && (
        <BackgroundShade isVisible={isSidebarOpen} />
      )}

      <TransitionGroup>
        {(isSidebarStatic || isSidebarOpen) && (
          <CSSTransition mountOnEnter timeout={200}>
            <AnalyticsProvider category="Sidebar">
              <Sidebar
                className={styles.sidebar}
                onClose={isSidebarStatic ? undefined : () => setIsSidebarOpen(false)}
                renderLogo={isSidebarStatic}
              />
            </AnalyticsProvider>
          </CSSTransition>
        )}
      </TransitionGroup>

      <div className={styles.body}>
        <AnalyticsProvider category="Header">
          <Header className={styles.header} />
        </AnalyticsProvider>

        <div className={styles.main}>
          {children}
        </div>

        {displayFooter && <Footer />}

        <BottomNavbar setIsSidebarOpen={setIsSidebarOpen} />
      </div>
    </div>
  );
}
