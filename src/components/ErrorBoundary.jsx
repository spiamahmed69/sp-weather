import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-xl rounded-3xl bg-white dark:bg-slate-800 p-8 text-center shadow-sm">
          <AlertTriangle size={40} className="mx-auto text-amber-500" />
          <h2 className="mt-4 text-lg font-bold text-ink dark:text-white">দুঃখিত, কিছু একটা সমস্যা হয়েছে</h2>
          <p className="mt-2 text-sm text-muted dark:text-slate-300">পাতাটি লোড করা যায়নি। আবার চেষ্টা করুন।</p>
          <button type="button" onClick={() => window.location.reload()} className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
            <RefreshCw size={16} /> আবার চেষ্টা করুন
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
