import React from 'react';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';

interface Props {
  children: ReactNode;
}

Bugsnag.start({
  apiKey: process.env.BUGSNAG_API_KEY || '',
  plugins: [new BugsnagPluginReact()],
});

const ErrorBoundary = Bugsnag.getPlugin('react')?.createErrorBoundary(React);

const ErrorTracker: React.FC<Props> = ({ children }: Props) => {
  if (ErrorBoundary) return <ErrorBoundary>{children}</ErrorBoundary>;
  else return children;
};

export default ErrorTracker;