import {
  TrendingUp, ShieldCheck, ShoppingCart,
  Headphones, Activity, AlertTriangle,
  CalendarClock, Smartphone, Package2,
  Leaf, BarChart2, FileText,
  ScanLine, Settings2,
} from 'lucide-react'

export const ICON_MAP = {
  TrendingUp, ShieldCheck, ShoppingCart, Headphones,
  Activity, AlertTriangle, CalendarClock, Smartphone,
  Package2, Leaf, BarChart2, FileText, ScanLine, Settings2,
}

export const CATEGORIES = {
  finance: {
    key: 'finance',
    barClass: 'bg-gradient-to-r from-cris-blue to-blue-400',
    tagClass: 'bg-blue-50 dark:bg-blue-900/30 text-cris-blue dark:text-blue-300 border border-blue-200 dark:border-blue-700/50',
    dotClass: 'bg-cris-blue',
  },
  support: {
    key: 'support',
    barClass: 'bg-gradient-to-r from-violet-500 to-purple-500',
    tagClass: 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700/50',
    dotClass: 'bg-violet-500',
  },
  manufacturing: {
    key: 'manufacturing',
    barClass: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    tagClass: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/50',
    dotClass: 'bg-emerald-500',
  },
  green: {
    key: 'green',
    barClass: 'bg-gradient-to-r from-teal-500 to-green-500',
    tagClass: 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700/50',
    dotClass: 'bg-teal-500',
  },
  special: {
    key: 'special',
    barClass: 'bg-gradient-to-r from-amber-500 to-orange-500',
    tagClass: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700/50',
    dotClass: 'bg-amber-500',
  },
}

// Index matches the `cases.items` array order in i18n locale files
export const CASES_META = [
  { id: 0,  category: 'finance',       icon: TrendingUp   },
  { id: 1,  category: 'finance',       icon: ShieldCheck  },
  { id: 2,  category: 'finance',       icon: ShoppingCart },
  { id: 3,  category: 'support',       icon: Headphones   },
  { id: 4,  category: 'support',       icon: Activity     },
  { id: 5,  category: 'support',       icon: AlertTriangle},
  { id: 6,  category: 'manufacturing', icon: CalendarClock},
  { id: 7,  category: 'manufacturing', icon: Smartphone   },
  { id: 8,  category: 'manufacturing', icon: Package2     },
  { id: 9,  category: 'green',         icon: Leaf         },
  { id: 10, category: 'green',         icon: BarChart2    },
  { id: 11, category: 'green',         icon: FileText     },
  { id: 12, category: 'special',       icon: ScanLine     },
  { id: 13, category: 'special',       icon: Settings2    },
]
