import React from 'react'

type State = { hasError: boolean, error?: Error }
export class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false }
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="container">
          <div className="error">
            <strong>Something went wrong.</strong>
            <div style={{ marginTop: 8 }}>{this.state.error?.message}</div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
