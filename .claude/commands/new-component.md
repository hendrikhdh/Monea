\# New Component: $ARGUMENTS



\## Task

Create a reusable component: $ARGUMENTS



\## Template



/\*\*

&#x20;\* \[Brief description of what this component does]

&#x20;\* @example <ComponentName prop1="value" onAction={() => {}} />

&#x20;\*/

import { cn } from '@/lib/utils'



interface ComponentNameProps {

&#x20; className?: string

&#x20; // Define all props here

}



export function ComponentName({ className }: ComponentNameProps) {

&#x20; return (

&#x20;   <div className={cn('', className)}>

&#x20;     {/\* Content \*/}

&#x20;   </div>

&#x20; )

}



\## Rules

\- Named export (no default export)

\- Props interface explicitly defined

\- cn() for conditional classes

\- Max 150 lines. If larger: split into sub-components

\- Accessibility: Appropriate aria labels and roles

\- Touch-friendly sizing (min 44x44px for interactive elements)



\## File location

\- Generic UI element: src/components/ui/

\- Form component: src/components/forms/

\- Layout element (Header, Nav, Shell): src/components/layout/

\- Feature-specific: src/components/features/

