'use client'

import { useState, useActionState } from 'react'
import { Mail, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { login, signup, signInWithOAuth, signInWithMagicLink } from './actions'

type AuthState = { error?: string; success?: string } | undefined
type AuthMode = 'login' | 'signup'

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const isSignup = mode === 'signup'

  const [loginState, loginAction, loginPending] = useActionState<AuthState, FormData>(
    async (_prev, formData) => login(formData),
    undefined
  )

  const [signupState, signupAction, signupPending] = useActionState<AuthState, FormData>(
    async (_prev, formData) => signup(formData),
    undefined
  )

  const [, googleAction, googlePending] = useActionState(
    async () => signInWithOAuth('google'),
    undefined
  )

  const [magicLinkState, magicLinkAction, magicLinkPending] = useActionState<AuthState, FormData>(
    async (_prev, formData) => signInWithMagicLink(formData),
    undefined
  )

  const isLoading = loginPending || signupPending || googlePending || magicLinkPending
  const state = isSignup ? signupState : loginState

  return (
    <>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes headline-breathe {
          0% { opacity: 0; transform: scale(1.35); filter: blur(14px); }
          45% { opacity: 1; transform: scale(0.94); filter: blur(0px); }
          100% { opacity: 1; transform: scale(1.12); filter: blur(0px); }
        }
        @keyframes subline-enter {
          0% { opacity: 0; transform: scale(0.9) translateY(16px); filter: blur(6px); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0px); }
        }
        @keyframes stagger-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="flex flex-col gap-5 animate-[fade-in_0.6s_ease-out]">
        {/* Branding */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1
            className="font-display text-5xl tracking-tight text-foreground"
            style={{
              animation: 'headline-breathe 6s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both',
            }}
          >
            Monéa
          </h1>
          <p
            className="text-base font-light tracking-[0.15em] text-muted-foreground"
            style={{
              animation: 'subline-enter 1.4s cubic-bezier(0.22, 1, 0.36, 1) 4.5s both',
            }}
          >
            Your money — but elevated
          </p>
        </div>

        {/* Quick Login Buttons */}
        <div
          className="flex flex-col gap-3"
          style={{ animation: 'stagger-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both' }}
        >
          <form action={googleAction}>
            <AuthButton type="submit" disabled={isLoading}>
              <GoogleIcon />
              Continue with Google
            </AuthButton>
          </form>
          <AppleButton disabled={isLoading} />
          <MagicLinkForm
            state={magicLinkState}
            action={magicLinkAction}
            pending={magicLinkPending}
            disabled={isLoading}
          />
        </div>

        {/* Divider */}
        <div
          className="flex items-center gap-4"
          style={{ animation: 'stagger-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.35s both' }}
        >
          <div className="h-px flex-1 bg-border" />
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
            or continue with email
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Mode Toggle */}
        <div
          className="relative flex rounded-2xl bg-surface-container-low p-1"
          style={{ animation: 'stagger-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both' }}
        >
          {(['login', 'signup'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                'relative z-10 flex-1 cursor-pointer rounded-xl py-2.5 text-sm font-semibold transition-all duration-200',
                mode === m
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground'
              )}
              style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
            >
              {m === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {/* Email/Password Form */}
        <form
          action={isSignup ? signupAction : loginAction}
          className="flex flex-col gap-3"
          style={{ animation: 'stagger-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.65s both' }}
        >
          <div
            className="overflow-hidden transition-all duration-300 ease-out"
            style={{
              maxHeight: isSignup ? 100 : 0,
              opacity: isSignup ? 1 : 0,
              marginBottom: isSignup ? 0 : -20,
            }}
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="auth-name" className="text-sm font-medium">Name</label>
              <input
                id="auth-name"
                name="name"
                type="text"
                placeholder="Your name"
                className="h-12 w-full rounded-2xl border border-input bg-transparent px-4 text-base placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-50"
                required={isSignup}
                disabled={isLoading || !isSignup}
                tabIndex={isSignup ? 0 : -1}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="auth-email" className="text-sm font-medium">Email</label>
            <input
              id="auth-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="h-12 w-full rounded-2xl border border-input bg-transparent px-4 text-base placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-50"
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="auth-password" className="text-sm font-medium">Password</label>
            <div className="relative">
              <input
                id="auth-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={isSignup ? 'Min. 8 characters' : '••••••••'}
                className="h-12 w-full rounded-2xl border border-input bg-transparent px-4 pr-14 text-base placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-50"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-0 top-0 flex h-12 w-14 items-center justify-center text-muted-foreground transition-colors active:text-foreground"
                style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          {signupState?.success && isSignup && (
            <p className="text-sm text-success">{signupState.success}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="h-12 cursor-pointer rounded-2xl bg-primary text-sm font-semibold text-primary-foreground transition-colors active:bg-primary/80 disabled:pointer-events-none disabled:opacity-50"
            style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
          >
            {isLoading
              ? (isSignup ? 'Creating account...' : 'Signing in...')
              : (isSignup ? 'Create Account' : 'Sign In')
            }
          </button>
        </form>
      </div>
    </>
  )
}

/* ─── Sub-components ─── */

function AuthButton({
  children,
  disabled,
  type = 'button',
  onClick,
}: {
  children: React.ReactNode
  disabled?: boolean
  type?: 'button' | 'submit'
  onClick?: () => void
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border border-border bg-background text-sm font-medium transition-colors active:bg-muted disabled:pointer-events-none disabled:opacity-50"
      style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
    >
      {children}
    </button>
  )
}

function MagicLinkForm({
  state,
  action,
  pending,
  disabled,
}: {
  state: AuthState
  action: (formData: FormData) => void
  pending: boolean
  disabled: boolean
}) {
  const [open, setOpen] = useState(false)
  const sent = state?.success

  return (
    <>
      <AuthButton disabled={disabled} onClick={() => setOpen(true)}>
        <Mail size={18} />
        Continue with Magic Link
      </AuthButton>

      <BottomSheet open={open} onClose={() => setOpen(false)}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 text-center">
            <h2 className="text-lg font-semibold">Magic Link</h2>
            <p className="text-sm text-muted-foreground">
              We&apos;ll send a sign-in link to your email
            </p>
          </div>

          {sent ? (
            <div className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-success/30 bg-success/5 text-sm font-medium text-success">
              <Mail size={18} />
              Check your email for the magic link!
            </div>
          ) : (
            <form action={action} className="flex flex-col gap-3">
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                className="h-12 w-full rounded-2xl border border-input bg-transparent px-4 text-base placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-50"
                required
                disabled={pending}
              />
              <button
                type="submit"
                disabled={pending}
                className="h-12 w-full cursor-pointer rounded-2xl bg-primary text-sm font-semibold text-primary-foreground transition-colors active:bg-primary/80 disabled:pointer-events-none disabled:opacity-50"
                style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
              >
                {pending ? 'Sending...' : 'Send Magic Link'}
              </button>
            </form>
          )}
        </div>
      </BottomSheet>
    </>
  )
}

function AppleButton({ disabled }: { disabled: boolean }) {
  const [showMessage, setShowMessage] = useState(false)

  return (
    <div className="relative">
      <AuthButton disabled={disabled} onClick={() => setShowMessage((v) => !v)}>
        <AppleIcon />
        Continue with Apple
      </AuthButton>
      {showMessage && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Apple Sign-In is not available yet — coming soon.
        </p>
      )}
    </div>
  )
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
      <path d="M14.94 14.28c-.39.87-.57 1.26-1.07 2.03-.69 1.08-1.67 2.43-2.88 2.44-1.07.01-1.35-.7-2.8-.69-1.46.01-1.76.7-2.83.69-1.21-.01-2.13-1.22-2.83-2.3C.84 13.8.31 10.75 1.24 8.64c.65-1.49 1.82-2.5 3.1-2.5 1.16-.01 1.89.78 2.85.78.93 0 1.5-.78 2.84-.78 1.14 0 2.17.62 2.82 1.6-2.48 1.36-2.08 4.9.09 5.84ZM11.37 4.04c.54-.69.95-1.66.8-2.64-.88.06-1.91.62-2.51 1.35-.55.66-1 1.65-.83 2.6.97.03 1.97-.54 2.54-1.31Z" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853" />
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335" />
    </svg>
  )
}
