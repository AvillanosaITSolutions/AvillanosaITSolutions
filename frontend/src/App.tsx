import {
    Button,
    Dropdown,
    DropdownItem,
    Navbar,
    NavbarBrand,
    NavbarCollapse,
    NavbarToggle,
} from 'flowbite-react'
import { ArrowRightAlt, Facebook, Github, Linkedin } from 'flowbite-react-icons/solid'
import { motion } from 'framer-motion'
import { type ChangeEvent, type FormEvent, type ReactNode, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Route, Routes, useLocation, useParams } from 'react-router-dom'

type RouteConfig = {
    path: string
    labelKey: string
}

type ProjectItem = {
    slug: string
    name: string
    category: string
    summary: string
    accentClass: string
    type: 'work' | 'solution'
    thumbnail?: string
    gallery?: string[]
    url?: string
    isCurrent?: boolean
}

const routeConfig: RouteConfig[] = [
    { path: '/', labelKey: 'nav.home' },
    { path: '/services', labelKey: 'nav.services' },
    { path: '/solutions', labelKey: 'nav.solutions' },
    { path: '/work', labelKey: 'nav.work' },
    { path: '/about', labelKey: 'nav.about' },
    { path: '/contact', labelKey: 'nav.contact' },
]

const projectItems: ProjectItem[] = [
    {
        slug: 'rentalbasic',
        name: 'RentalBasic',
        category: 'Currently Building - Rental Platform',
        summary: 'An event supplier and rental operations platform focused on matching, inventory visibility, and real-time workflows.',
        accentClass: 'from-sage-200 to-teal-100',
        type: 'solution',
        thumbnail: '/rentalbasic.svg',
        gallery: ['/rentalbasic_website.png', '/rentalbasic.gif'],
        url: 'https://rentalbasic.com',
        isCurrent: true,
    },
    {
        slug: 'gx-rose-prints',
        name: 'GX ROSE PRINTS website',
        category: 'Client Website - Personalized Prints & Souvenirs',
        summary: 'Personalized prints and souvenirs for birthdays, weddings, school activities, business branding, and giveaways.',
        accentClass: 'from-rose-100 to-amber-50',
        type: 'work',
        thumbnail: '/gxrose_logo.jpg',
        url: 'https://gxroseprints.com',
    },
    {
        slug: 'rockys-cafe',
        name: "Rocky's Cafe",
        category: 'Coffee Shop & Event Catering',
        summary: 'A warm neighborhood cafe with bold flavors. Coffee, comfort food, and event catering in one cozy place.',
        accentClass: 'from-amber-100 to-orange-100',
        type: 'work',
        thumbnail: '/rockyscafe9.jpg',
        url: 'https://avillanosaitsolutions.github.io/rockyscafe9/',
    },
    {
        slug: 'coralwind-expeditions',
        name: 'CoralWind Expeditions',
        category: 'Client Website - Tourism & Travel',
        summary: 'Authentic bangka boat expeditions through the pristine waters of Coron, Palawan — island hopping, wreck diving, sunset cruises, and private charters.',
        accentClass: 'from-sky-100 to-teal-100',
        type: 'solution',
        thumbnail: 'https://avillanosaitsolutions.github.io/coralwind_expeditions/assets/hero-lTzpiZfs.jpg',
        url: 'https://avillanosaitsolutions.github.io/coralwind_expeditions',
    },
    {
        slug: 'orbit-gadget-co',
        name: 'Orbit Gadget Co.',
        category: 'Client Website - Gadget Retail & Repair',
        summary: 'Apple & Android gadgets, screen repairs, battery replacements, and flexible installment plans — all under one roof in a city-center shop.',
        accentClass: 'from-blue-100 to-indigo-100',
        type: 'solution',
        thumbnail: '@file:orbit-gadget.png',
        url: 'https://avillanosaitsolutions.github.io/orbit-gadget-co',
    },
    {
        slug: 'peso-stack-transparency-visualizer',
        name: 'Peso Stack Transparency Visualizer',
        category: 'Civic Tech - Public Transparency Tool',
        summary: 'A web-based visualization tool that represents large financial figures using stacks of Philippine peso bills, making corruption-related and public spending data easier to understand.',
        accentClass: 'from-emerald-100 to-cyan-100',
        type: 'solution',
        thumbnail: '/buttload.png',
        url: 'https://avillanosaitsolutions.github.io/buttload',
    },
    {
        slug: 'sip-n-bite-nutrition',
        name: 'Sip n Bite Nutrition',
        category: 'Client Website - Nutrition & Wellness',
        summary: 'A website for Sip n Bite Nutrition.',
        accentClass: 'from-lime-100 to-emerald-100',
        type: 'work',
        url: 'https://88.222.245.88.sslip.io/',
    },
    {
        slug: 'cluck-fighters',
        name: 'Cluck Fighters',
        category: 'Web Game - PvP',
        summary: 'A PvP game with chickens.',
        accentClass: 'from-amber-100 to-red-100',
        type: 'work',
        url: 'https://chicken.88-222-245-88.nip.io/',
    },
    {
        slug: 'virtual-rage-room',
        name: 'Virtual Rage Room',
        category: 'Interactive Web Experience',
        summary: 'A virtual rage room.',
        accentClass: 'from-slate-200 to-rose-100',
        type: 'work',
        url: 'https://rage.88-222-245-88.nip.io/',
    },
]

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^09\d{9}$/

function FadeInOnView({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    )
}

function getServiceThumbnail(service: string) {
    const value = service.toLowerCase()

    if (value.includes('blog')) return `/blog_site.jpg`
    if (value.includes('consultancy')) return `/consultancy.jpg`
    if (value.includes('enterprise')) return `/enterprise_software_development.jpg`
    if (value.includes('mobile')) return `/app_development.jpg`
    if (value.includes('design') || value.includes('branding')) return `/design_and_branding.jpg`
    if (value.includes('website')) return `/web_design.jpg`

    return `/web_design.jpg`
}

function ImageWithSkeleton({
    src,
    alt,
    className,
    wrapperClassName,
    loading = 'lazy',
    onError,
    width,
    height,
}: {
    src: string
    alt: string
    className: string
    wrapperClassName?: string
    loading?: 'lazy' | 'eager'
    onError?: () => void
    width?: number
    height?: number
}) {
    const [isLoading, setIsLoading] = useState(true)
    const imgRef = useRef<HTMLImageElement>(null)

    useEffect(() => {
        const img = imgRef.current
        if (img && img.complete && img.naturalWidth > 0) {
            setIsLoading(false)
        } else {
            setIsLoading(true)
        }
    }, [src])

    return (
        <div className={`relative overflow-hidden ${wrapperClassName ?? ''}`}>
            {isLoading && <div className="absolute inset-0 animate-pulse bg-slate-200" aria-hidden="true" />}
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                loading={loading}
                decoding="async"
                width={width}
                height={height}
                className={`${className} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setIsLoading(false)
                    onError?.()
                }}
            />
        </div>
    )
}

// Live screenshot of a site via thum.io (no API key required). Used as the
// primary preview for any work item that links to a real URL.
function getSitePreview(url: string) {
    return `https://image.thum.io/get/width/800/crop/500/noanimate/${url}`
}

function WorkCardThumbnail({
    item,
    wrapperClassName = 'aspect-[16/10] w-full rounded-sm ring-1 ring-slate-200',
    imgClassName = 'h-full w-full rounded-sm object-cover',
}: {
    item: ProjectItem
    wrapperClassName?: string
    imgClassName?: string
}) {
    const imageCandidates = [
        item.url ? getSitePreview(item.url) : undefined,
        item.thumbnail,
        '/app_logo.png',
    ].filter((candidate): candidate is string => Boolean(candidate))

    const [imageIndex, setImageIndex] = useState(0)
    const src = imageCandidates[imageIndex]

    if (!src) {
        return <div className={`bg-gradient-to-br ${item.accentClass} ${wrapperClassName}`} />
    }

    return (
        <ImageWithSkeleton
            src={src}
            alt={`${item.name} preview`}
            wrapperClassName={wrapperClassName}
            className={imgClassName}
            onError={() => setImageIndex((currentIndex) => currentIndex + 1)}
        />
    )
}


function SiteHeader() {
    const location = useLocation()
    const { i18n, t } = useTranslation()

    const isActivePath = (path: string) => {
        if (path === '/') return location.pathname === '/'
        return location.pathname.startsWith(path)
    }

    const languageItems = (
        <>
            <DropdownItem className="text-slate-800 hover:bg-sage-50" onClick={() => i18n.changeLanguage('en')}>
                {t('language.english')}
            </DropdownItem>
            <DropdownItem className="text-slate-800 hover:bg-sage-50" onClick={() => i18n.changeLanguage('fil')}>
                {t('language.filipino')}
            </DropdownItem>
        </>
    )

    const languageMenu = (
        <>
            <div className="hidden md:block">
                <Dropdown label={t('language.current')} inline className="text-slate-700 text-base">
                    {languageItems}
                </Dropdown>
            </div>

            <div className="md:hidden">
                <Dropdown
                    label={(
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-slate-200 text-slate-600" title={t('language.current')}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
                                <circle cx="12" cy="12" r="9" />
                                <path d="M3 12h18" />
                                <path d="M12 3a14 14 0 0 1 0 18" />
                                <path d="M12 3a14 14 0 0 0 0 18" />
                            </svg>
                        </span>
                    )}
                    inline
                    arrowIcon={false}
                    className="text-slate-700"
                >
                    {languageItems}
                </Dropdown>
            </div>
        </>
    )

    const renderNavLinks = () =>
        routeConfig.map((route) => (
            <Link
                key={route.path}
                to={route.path}
                className={`rounded-sm px-2 py-1 text-[13px] font-bold uppercase tracking-[0.15em] transition ${isActivePath(route.path)
                    ? 'text-sage-700 underline decoration-sage-500 decoration-2 underline-offset-8'
                    : 'text-slate-500 hover:text-slate-800'
                    }`}
            >
                {t(route.labelKey)}
            </Link>
        ))

    return (
        <Navbar
            fluid
            rounded
            className="site-header z-40 !border-0 !bg-transparent py-5 shadow-none text-slate-500 w-[min(1100px,calc(100%-2.25rem))] mx-auto"
            style={{ backgroundColor: 'transparent' }}
        >
            <NavbarBrand as={Link} href="/" className="gap-2">
                <img src="/app_logo.png" alt="Avillanosa IT Solutions logo" className="h-10 w-10 object-contain" />
                <div className="self-center leading-tight">
                    <span className="block whitespace-nowrap text-[22px] font-semibold tracking-tight text-slate-600">ItsAvillanosa</span>
                    <span className="hidden whitespace-nowrap text-[10px] font-medium tracking-[0.08em] uppercase text-slate-400 md:block">Avillanosa Information Technology Solutions</span>
                </div>
            </NavbarBrand>

            <div className="hidden md:flex md:flex-1 md:items-center md:justify-end md:gap-2">
                {renderNavLinks()}
                <div className="md:pl-3">{languageMenu}</div>
            </div>

            <div className="flex items-center gap-2 md:hidden">
                <div>{languageMenu}</div>
                <NavbarToggle className="inline-flex h-10 w-10 items-center justify-center rounded-sm p-2 text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 [&>svg]:h-6 [&>svg]:w-6" />
            </div>

            <NavbarCollapse className="nav-caps !bg-transparent md:!hidden">
                {renderNavLinks()}
            </NavbarCollapse>
        </Navbar>
    )
}

function InquireNowModal({ onClose }: { onClose: () => void }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-md rounded-sm bg-white p-8 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-xl leading-none"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ✕
                </button>

                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Get In Touch</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Contact Us</h2>

                <div className="mt-6 space-y-5">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Email</p>
                        <a
                            href="mailto:hello@itsavillanosa.com"
                            className="mt-1 block text-base font-medium text-slate-800 hover:text-sage-700 break-all"
                        >
                            hello@itsavillanosa.com
                        </a>
                    </div>

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Contact No.</p>
                        <a
                            href="tel:+639452873791"
                            className="mt-1 block text-base font-medium text-slate-800 hover:text-sage-700"
                        >
                            (+63) 945 287 3791
                        </a>
                    </div>

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Office Address</p>
                        <p className="mt-1 text-base font-medium text-slate-800 leading-snug">
                            Unit-A JDN Apartment Bgy Irawan,<br />Puerto Princesa City, Palawan
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Follow Us</p>
                        <div className="mt-2 flex items-center gap-5 text-slate-600">
                            <a href="https://www.facebook.com/profile.php?id=61565257933229" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-sage-700"><Facebook size={22} /></a>
                            <a href="https://www.linkedin.com/company/avillanosa-information-technology-solutions" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-sage-700"><Linkedin size={22} /></a>
                            <a href="https://github.com/AvillanosaITSolutions" target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-sage-700"><Github size={22} /></a>
                        </div>
                    </div>
                </div>

                <Link
                    to="/contact"
                    onClick={onClose}
                    className="mt-8 block"
                >
                    <Button color="light" className="w-full rounded-none border-0 !bg-sage-800 !text-white py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] hover:!bg-sage-700">
                        Send Us a Message
                    </Button>
                </Link>
            </div>
        </div>
    )
}

function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null)
    const [isHovering, setIsHovering] = useState(false)

    useEffect(() => {
        const cursor = cursorRef.current
        if (!cursor) return

        const move = (e: MouseEvent) => {
            cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
        }

        const handleOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (target.closest('a, button, [role="button"], input, textarea, select, label')) {
                setIsHovering(true)
            }
        }

        const handleOut = () => setIsHovering(false)

        window.addEventListener('mousemove', move)
        document.addEventListener('mouseover', handleOver)
        document.addEventListener('mouseout', handleOut)
        return () => {
            window.removeEventListener('mousemove', move)
            document.removeEventListener('mouseover', handleOver)
            document.removeEventListener('mouseout', handleOut)
        }
    }, [])

    return (
        <div
            ref={cursorRef}
            className={`custom-cursor ${isHovering ? 'is-hovering' : ''}`}
        >
            <div className="custom-cursor-dot" />
        </div>
    )
}

function DarkHeroSection() {
    return (
        <section className="hero-spotlight relative min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-20">
            {/* Background timelapse */}
            <div className="hero-media-wrap">
                <img
                    src="/timelapse.gif"
                    alt=""
                    aria-hidden="true"
                    className="hero-media"
                />
                <div className="hero-media-overlay" />
            </div>

            <div className="site-shell-wide relative z-10">
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-sm tracking-[0.2em] text-sage-400 uppercase"
                >
                    Since 2024
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-6 text-[clamp(3rem,9vw,7rem)] font-extrabold leading-[0.95] tracking-tight"
                    style={{ color: '#e8e2d4' }}
                >
                    BUILDING<br />
                    <span className="ml-4 md:ml-12">DIGITAL</span><br />
                    <span className="ml-10 md:ml-24">TOOLS &</span><br />
                    <span className="ml-6 md:ml-16">EXPERIENCES</span><br />
                    <span className="ml-10 md:ml-28">FOR IMPACT</span>
                </motion.h1>

                <div className="mt-12 flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <Link to="/work">
                            <button className="rounded-full border border-gray-500 px-6 py-2.5 text-sm text-gray-300 hover:border-sage-400 hover:text-sage-400 transition-colors">
                                Our Work
                            </button>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <Link to="/services">
                            <button className="rounded-full border border-sage-500 px-6 py-2.5 text-sm text-sage-400 hover:bg-sage-500 hover:text-white transition-colors">
                                Our Services
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

function DarkDescriptionSection() {
    return (
        <FadeInOnView>
            <section className="py-24 text-center">
                <p className="site-shell text-lg md:text-xl leading-relaxed text-gray-400">
                    We are a digital agency that helps organizations and individuals
                    create impact by building web and mobile applications.
                </p>
            </section>
        </FadeInOnView>
    )
}

const serviceData = [
    {
        title: 'Web & Software Development',
        items: ['Custom Web Applications', 'E-Commerce Platforms', 'Content Management Systems', 'API Development & Integration', 'Progressive Web Apps'],
    },
    {
        title: 'Mobile App Development',
        items: ['Cross-Platform Apps', 'Native Android & iOS', 'App Prototyping', 'App Store Deployment', 'Maintenance & Updates'],
    },
    {
        title: 'Design & Branding',
        items: ['UI/UX Design', 'Brand Identity', 'Graphic Design', 'Design Systems', 'Marketing Collateral'],
    },
    {
        title: 'Enterprise Solutions',
        items: ['ERP & CRM Systems', 'Workflow Automation', 'Business Intelligence', 'Cloud Infrastructure', 'System Integration'],
    },
    {
        title: 'IT Consultancy',
        items: ['Technology Audits', 'Digital Strategy', 'Architecture Planning', 'Vendor Selection', 'Security Assessment'],
    },
    {
        title: 'Digital Transformation',
        items: ['Evaluation & Impact Assessment', 'Implementation Support', 'Proof of Concept Development', 'Feasibility Studies', 'Research & Strategy'],
    },
]

function DarkServicesSection() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)

    return (
        <section className="py-16">
            <div className="site-shell-wide">
                <div className="space-y-2">
                    {serviceData.map((service, index) => (
                        <motion.div
                            key={service.title}
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                            className="relative"
                            onMouseEnter={() => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(null)}
                        >
                            <div className={`service-outline ${activeIndex === index ? 'is-active' : ''}`}>
                                {service.title.toUpperCase()}
                            </div>

                            {activeIndex === index && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="service-popup"
                                >
                                    <p className="text-sm font-bold text-white tracking-wide mb-3">
                                        {service.title.toUpperCase()}
                                    </p>
                                    {service.items.map((item) => (
                                        <Link
                                            key={item}
                                            to="/services"
                                            className="block py-2 text-sm text-gray-300 hover:text-sage-400 transition-colors border-b border-dark-600 last:border-0"
                                        >
                                            {item}
                                        </Link>
                                    ))}
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-10"
                >
                    <Link to="/services">
                        <button className="rounded-full border border-gray-600 px-8 py-3 text-sm text-gray-300 hover:border-sage-400 hover:text-sage-400 transition-colors">
                            Explore our services
                        </button>
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}

function DarkProjectsSection() {
    const featured = projectItems.filter((item) => item.url)

    return (
        <section className="py-24">
            <div className="site-shell-wide">
                <div className="mb-6 flex items-center gap-4">
                    <span className="h-px w-14 bg-sage-500" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">Featured Work</span>
                </div>

                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4" style={{ color: '#e8e2d4' }}>
                    OUR PROJECTS
                </h2>
                <p className="max-w-2xl text-sm leading-7 text-gray-500 mb-12">
                    Websites, platforms, and digital experiences we've built for clients across various industries.
                </p>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {featured.map((item, index) => (
                        <motion.a
                            key={item.slug}
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                            className="group relative block overflow-hidden rounded-lg border border-dark-600 bg-dark-800 transition-colors hover:border-sage-500/40"
                        >
                            <div className="aspect-[16/10] w-full overflow-hidden bg-dark-700">
                                <img
                                    src={getSitePreview(item.url!)}
                                    alt={`${item.name} screenshot`}
                                    loading="lazy"
                                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                    onError={(e) => {
                                        const target = e.currentTarget
                                        if (item.thumbnail && !target.dataset.fallback) {
                                            target.dataset.fallback = '1'
                                            target.src = item.thumbnail
                                        }
                                    }}
                                />
                            </div>

                            <div className="p-5">
                                <h3 className="text-base font-bold text-gray-200 group-hover:text-sage-400 transition-colors">
                                    {item.name}
                                </h3>
                                <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-sage-500">
                                    {item.category}
                                </p>
                                <p className="mt-2 text-sm leading-6 text-gray-500 line-clamp-2">
                                    {item.summary}
                                </p>

                                <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-gray-400 group-hover:text-sage-400 transition-colors">
                                    <ArrowRightAlt size={14} />
                                    View Project
                                </span>
                            </div>
                        </motion.a>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-10 text-center"
                >
                    <Link to="/work">
                        <button className="rounded-full border border-gray-600 px-8 py-3 text-sm text-gray-300 hover:border-sage-400 hover:text-sage-400 transition-colors">
                            View all projects
                        </button>
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}

function DarkIndustriesSection() {
    const industries = ['CORPORATE', 'STARTUP', 'E-COMMERCE', 'TOURISM', 'CIVIC TECH', 'FOOD & BEVERAGE']

    return (
        <FadeInOnView>
            <section className="py-24">
                <div className="site-shell text-center">
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight" style={{ color: '#e8e2d4' }}>
                        DIGITAL SOLUTIONS<br />SPANNING INDUSTRIES
                    </h2>

                    <div className="mt-4 flex justify-center">
                        <img src="/app_logo.png" alt="Avillanosa IT Solutions" className="h-10 w-10 object-contain" />
                    </div>

                    <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                        {industries.map((industry, i) => (
                            <div key={industry} className="flex items-center gap-6">
                                <span className="text-sm font-bold tracking-[0.15em] text-gray-400">{industry}</span>
                                {i < industries.length - 1 && (
                                    <span className="h-2 w-2 rounded-full bg-sage-500" />
                                )}
                            </div>
                        ))}
                    </div>

                    <p className="mx-auto mt-10 max-w-2xl text-sm leading-7 text-gray-500">
                        We take immense pride in providing digital solutions and services that transcend industries.
                        Whether you're in e-commerce, tourism, food & beverage, civic tech, or any other sector,
                        our expertise ensures that your digital presence meets and exceeds standards.
                    </p>
                </div>
            </section>
        </FadeInOnView>
    )
}

function DarkCTASection() {
    return (
        <FadeInOnView>
            <section className="hero-spotlight relative py-28">
                <div className="site-shell relative z-10 text-center">
                    <h2 className="text-[clamp(2.5rem,7vw,5.5rem)] font-extrabold leading-[0.95] tracking-tight" style={{ color: '#e8e2d4' }}>
                        LETS CREATE<br />IMPACT<br />TOGETHER
                    </h2>

                    <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
                        <Link to="/about">
                            <button className="rounded-full border border-gray-500 px-8 py-3 text-sm text-gray-300 hover:border-sage-400 hover:text-sage-400 transition-colors">
                                Join us
                            </button>
                        </Link>
                        <Link to="/contact">
                            <button className="rounded-full border border-sage-500 px-8 py-3 text-sm text-sage-400 hover:bg-sage-500 hover:text-white transition-colors">
                                Start a project
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </FadeInOnView>
    )
}

function DarkFooterSection() {
    return (
        <footer className="border-t border-dark-700 py-10">
            <div className="site-shell-wide flex flex-col items-center gap-6 md:flex-row md:justify-between">
                <div className="text-center md:text-left">
                    <p className="text-sm text-gray-400">Unit-A JDN Apartment Bgy Irawan,</p>
                    <p className="text-sm text-gray-400">Puerto Princesa City, Palawan</p>
                </div>

                <div className="text-center md:text-right">
                    <a href="tel:+639452873791" className="text-sm text-gray-300 hover:text-sage-400 transition-colors underline">
                        (+63) 945 287 3791
                    </a>
                    <div className="mt-3 flex items-center justify-center gap-4 md:justify-end">
                        <a href="https://www.facebook.com/profile.php?id=61565257933229" target="_blank" rel="noreferrer" aria-label="Facebook" className="text-gray-500 hover:text-sage-400 transition-colors">
                            <Facebook size={20} />
                        </a>
                        <a href="https://www.linkedin.com/company/avillanosa-information-technology-solutions" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-gray-500 hover:text-sage-400 transition-colors">
                            <Linkedin size={20} />
                        </a>
                        <a href="https://github.com/AvillanosaITSolutions" target="_blank" rel="noreferrer" aria-label="GitHub" className="text-gray-500 hover:text-sage-400 transition-colors">
                            <Github size={20} />
                        </a>
                    </div>
                </div>
            </div>

            <div className="site-shell-wide mt-6 text-center">
                <p className="text-xs text-gray-600">
                    &copy; {new Date().getFullYear()} Avillanosa Information Technology Solutions. All rights reserved.
                </p>
            </div>
        </footer>
    )
}

function ContactBand({ onInquire }: { onInquire: () => void }) {
    const { t } = useTranslation()

    return (
        <FadeInOnView>
            <section className="site-shell mt-24 border-t border-slate-200 pt-20">
                <div className="grid gap-x-6 gap-y-16 md:grid-cols-12">
                    <div className="min-w-0 md:col-span-4">
                        <p className="text-xs text-slate-400">Email</p>
                        <p className="mt-3 break-words text-2xl leading-tight font-medium tracking-tight text-slate-800 md:text-[30px]">
                            hello@itsavillanosa.com
                        </p>

                        <p className="mt-10 text-xs text-slate-400">Contact No.</p>
                        <p className="mt-3 text-2xl leading-tight font-medium tracking-tight text-slate-800 md:text-[30px]">(+63) 945 287 3791</p>
                    </div>

                    <div className="min-w-0 md:col-span-5">
                        <p className="text-xs text-slate-400">Office Address</p>
                        <p className="mt-3 max-w-md text-xl leading-tight text-slate-800 md:text-[24px]">
                            Unit-A JDN Apartment Bgy Irawan, Puerto Princesa City, Palawan
                        </p>

                        <img src="/bir.png" alt="BIR registration" className="mt-12 h-auto w-full max-w-[320px] object-contain" />
                    </div>

                    <div className="md:col-span-3 md:justify-self-start">
                        <p className="text-xs text-slate-400">Follow</p>
                        <div className="mt-5 flex items-center gap-6 text-2xl text-slate-700">
                            <a href="https://www.facebook.com/profile.php?id=61565257933229" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-sage-700"><Facebook size={24} /></a>
                            <a href="https://www.linkedin.com/company/avillanosa-information-technology-solutions" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-sage-700"><Linkedin size={24} /></a>
                            <a href="https://github.com/AvillanosaITSolutions" target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-sage-700"><Github size={24} /></a>
                        </div>

                        <Button
                            color="light"
                            className="mt-14 w-full rounded-none border-0 !bg-sage-400 !text-white px-10 py-3 text-sm font-bold uppercase tracking-[0.16em] hover:!bg-sage-500 md:w-[300px]"
                            onClick={onInquire}
                        >
                            {t('home.hero.actions.inquireNow')}
                        </Button>
                    </div>
                </div>
            </section>
        </FadeInOnView>
    )
}

function HomePage() {
    return (
        <>
            <CustomCursor />
            <DarkHeroSection />
            <DarkDescriptionSection />
            <DarkServicesSection />
            <DarkProjectsSection />
            <DarkIndustriesSection />
            <DarkCTASection />
            <DarkFooterSection />
        </>
    )
}

function ServicesPage() {
    const { t } = useTranslation()
    const offers = t('home.hero.offers', { returnObjects: true }) as string[]

    return (
        <FadeInOnView>
            <section className="site-shell py-24">
                <h1 className="text-5xl font-bold tracking-tight text-slate-900">{t('pages.services.title')}</h1>
                <p className="mt-4 max-w-3xl text-slate-600">Explore our core service offerings built to help businesses launch, grow, and operate efficiently.</p>

                <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                    {offers.map((service, index) => (
                        <article
                            key={service}
                            className="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm"
                            style={{ animationDelay: `${index * 60}ms` }}
                        >
                            <ImageWithSkeleton
                                src={getServiceThumbnail(service)}
                                alt={`${service} service`}
                                loading="lazy"
                                width={480}
                                height={300}
                                wrapperClassName="aspect-[16/10] w-full"
                                className="h-full w-full object-cover"
                            />
                            <div className="p-4">
                                <h2 className="text-base font-semibold text-slate-800">{service}</h2>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </FadeInOnView>
    )
}

function SolutionsPage() {
    const solutionItems = projectItems.filter((item) => item.type === 'solution')
    return (
        <FadeInOnView>
            <section className="site-shell py-24">
                <h1 className="text-5xl font-bold tracking-tight text-slate-900">Solutions</h1>
                <p className="mt-4 max-w-3xl text-slate-600">Products and platforms we are building to solve real operational problems.</p>

                <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                    {solutionItems.map((item) => (
                        <article key={item.slug} className="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm">
                            <WorkCardThumbnail
                                item={item}
                                wrapperClassName="aspect-[16/10] w-full"
                                imgClassName="h-full w-full object-cover"
                            />

                            <div className="p-4">
                                <h2 className="text-base font-semibold text-slate-800">{item.name}</h2>
                                <p className="mt-1 text-xs text-slate-500">{item.category}</p>
                                <p className="mt-2 text-xs leading-6 text-slate-500">{item.summary}</p>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    {item.url && (
                                        <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex">
                                            <Button color="light" size="xs" className="rounded-none border border-slate-200 !bg-white !text-slate-700">
                                                <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em]">
                                                    <ArrowRightAlt size={14} />
                                                    Website
                                                </span>
                                            </Button>
                                        </a>
                                    )}
                                    <Link to={`/work/${item.slug}`} className="inline-flex">
                                        <Button color="light" size="xs" className="rounded-none border border-slate-200 !bg-white !text-slate-700">
                                            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em]">
                                                <ArrowRightAlt size={14} />
                                                Details
                                            </span>
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </FadeInOnView>
    )
}

function WorkPage() {
    const workItems = projectItems.filter((item) => item.type === 'work')
    return (
        <FadeInOnView>
            <section className="site-shell py-24">
                <h1 className="text-5xl font-bold tracking-tight text-slate-900">Work</h1>
                <p className="mt-4 max-w-3xl text-slate-600">Client projects we have delivered — websites, platforms, and digital experiences.</p>

                <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                    {workItems.map((item) => (
                        <article key={item.slug} className="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm">
                            <WorkCardThumbnail
                                item={item}
                                wrapperClassName="aspect-[16/10] w-full"
                                imgClassName="h-full w-full object-cover"
                            />

                            <div className="p-4">
                                <h2 className="text-base font-semibold text-slate-800">{item.name}</h2>
                                <p className="mt-1 text-xs text-slate-500">{item.category}</p>
                                <p className="mt-2 text-xs leading-6 text-slate-500">{item.summary}</p>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    {item.url && (
                                        <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex">
                                            <Button color="light" size="xs" className="rounded-none border border-slate-200 !bg-white !text-slate-700">
                                                <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em]">
                                                    <ArrowRightAlt size={14} />
                                                    Website
                                                </span>
                                            </Button>
                                        </a>
                                    )}
                                    <Link to={`/work/${item.slug}`} className="inline-flex">
                                        <Button color="light" size="xs" className="rounded-none border border-slate-200 !bg-white !text-slate-700">
                                            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em]">
                                                <ArrowRightAlt size={14} />
                                                Details
                                            </span>
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </FadeInOnView>
    )
}

function ProjectDetailsPage() {
    const { projectSlug } = useParams<{ projectSlug: string }>()
    const project = projectItems.find((item) => item.slug === projectSlug)
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

    if (!project) {
        return (
            <FadeInOnView>
                <section className="site-shell py-24">
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900">Project not found</h1>
                    <p className="mt-4 text-slate-600">The project page you are looking for does not exist yet.</p>
                    <Link to="/work" className="mt-6 inline-flex">
                        <Button color="light" className="rounded-none border border-slate-200 !bg-white !text-slate-700">
                            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em]">
                                <ArrowRightAlt size={14} />
                                Back to Work
                            </span>
                        </Button>
                    </Link>
                </section>
            </FadeInOnView>
        )
    }

    return (
        <FadeInOnView>
            <section className="site-shell py-24">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Project Details</p>
                <h1 className="mt-2 text-5xl font-bold tracking-tight text-slate-900">{project.name}</h1>
                <p className="mt-4 max-w-3xl text-slate-600">{project.summary}</p>
                <p className="mt-3 text-sm font-medium text-sage-700">{project.category}</p>

                {project.gallery && project.gallery.length > 0 ? (
                    <div className="mt-8 max-w-3xl">
                        {project.thumbnail && (
                            <img src={project.thumbnail} alt={`${project.name} logo`} className="mb-6 h-12 w-auto object-contain" />
                        )}
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {project.gallery.map((src, i) => (
                                <motion.button
                                    key={src}
                                    onClick={() => setLightboxSrc(src)}
                                    initial={{ opacity: 0, y: 18 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                                    className="group overflow-hidden rounded-sm border border-slate-200 shadow-sm cursor-zoom-in"
                                >
                                    <img
                                        src={src}
                                        alt={`${project.name} preview ${i + 1}`}
                                        className="aspect-[4/3] w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </motion.button>
                            ))}
                        </div>
                    </div>
                ) : project.thumbnail ? (
                    <img src={project.thumbnail} alt={`${project.name} preview`} className="mt-8 w-full max-w-4xl rounded-sm border border-slate-200 object-cover" />
                ) : (
                    <div className={`mt-8 h-64 w-full max-w-4xl rounded-sm bg-gradient-to-br ${project.accentClass}`} />
                )}

                {/* Lightbox */}
                {lightboxSrc && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                        onClick={() => setLightboxSrc(null)}
                    >
                        <button
                            className="absolute top-4 right-4 text-white text-3xl leading-none hover:opacity-70"
                            onClick={() => setLightboxSrc(null)}
                            aria-label="Close"
                        >
                            ✕
                        </button>
                        <img
                            src={lightboxSrc}
                            alt="Full view"
                            className="max-h-[90vh] max-w-[90vw] rounded-sm object-contain shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                )}

                <div className="mt-8 flex flex-wrap gap-3">
                    {project.url && (
                        <a href={project.url} target="_blank" rel="noreferrer" className="inline-flex">
                            <Button color="light" className="rounded-none border border-slate-200 !bg-white !text-slate-700">
                                <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em]">
                                    <ArrowRightAlt size={16} />
                                    Visit Website
                                </span>
                            </Button>
                        </a>
                    )}
                    <Link to="/work" className="inline-flex">
                        <Button color="light" className="rounded-none border border-slate-200 !bg-white !text-slate-700">
                            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em]">
                                <ArrowRightAlt size={16} />
                                Back to Work
                            </span>
                        </Button>
                    </Link>
                </div>
            </section>
        </FadeInOnView>
    )
}

function AboutPage() {
    const { t } = useTranslation()
    const who = t('pages.about.who', { returnObjects: true }) as Array<{ value: string; label: string }>
    const background = t('pages.about.bg', { returnObjects: true }) as Array<{ title: string; description: string }>
    const think = t('pages.about.think', { returnObjects: true }) as Array<{ title: string; description: string }>

    return (
        <div className="py-20">
            {/* Hero */}
            <FadeInOnView>
                <div className="site-shell">
                    <div className="mb-8 flex items-center gap-4">
                        <span className="h-px w-14 bg-sage-500" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-700">{t('pages.about.label')}</span>
                    </div>
                    <h1 className="max-w-3xl text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[1.08] tracking-tight text-slate-900">
                        {t('pages.about.introLead1')}<br />{t('pages.about.introLead2')}
                    </h1>
                </div>
            </FadeInOnView>

            {/* Banner image */}
            <FadeInOnView delay={0.06}>
                <div className="site-shell mt-10">
                    <img
                        src="/consultancy.jpg"
                        alt="Avillanosa IT Solutions workspace"
                        className="w-full rounded-sm object-cover"
                        style={{ maxHeight: '400px' }}
                    />
                </div>
            </FadeInOnView>

            {/* Intro paragraphs */}
            <FadeInOnView delay={0.1}>
                <div className="site-shell mt-12 max-w-3xl space-y-5 text-sm leading-8 text-slate-600">
                    <p>{t('pages.about.introPara1')}</p>
                    <p className="font-medium text-slate-800">{t('pages.about.introPara2')}</p>
                    <p>{t('pages.about.introPara3')}</p>
                    <p className="italic text-slate-500">{t('pages.about.introPara4')}</p>
                </div>
            </FadeInOnView>

            {/* Who We Are */}
            <FadeInOnView>
                <div className="site-shell mt-20">
                    <div className="mb-10 flex items-center gap-4">
                        <span className="h-px w-14 bg-sage-500" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-700">{t('pages.about.whoTitle')}</span>
                    </div>
                    <div className="grid gap-x-8 gap-y-6 border-t border-slate-100 pt-8 sm:grid-cols-2 lg:grid-cols-4">
                        {who.map((item) => (
                            <div key={item.value} className="border-l-2 border-sage-400 pl-4">
                                <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-slate-800">{item.value}</p>
                                <p className="mt-1 text-xs leading-5 text-slate-500">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </FadeInOnView>

            {/* Experience That Backs Us */}
            <FadeInOnView>
                <div className="site-shell mt-20">
                    <div className="mb-8 flex items-center gap-4">
                        <span className="h-px w-14 bg-sage-500" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-700">{t('pages.about.bgTitle')}</span>
                    </div>
                    <p className="max-w-3xl text-sm leading-8 text-slate-600">{t('pages.about.bgLead')}</p>
                    <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                        {background.map((item, index) => (
                            <motion.article
                                key={item.title}
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.35 }}
                                transition={{ duration: 0.42, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                                className="border-l-2 border-sage-400 pl-4"
                            >
                                <h3 className="text-[15px] font-bold leading-snug text-sage-700">{item.title}</h3>
                                <p className="mt-1 text-xs leading-6 text-slate-500">{item.description}</p>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </FadeInOnView>

            {/* How We Think */}
            <FadeInOnView>
                <div className="site-shell mt-20">
                    <div className="mb-10 flex items-center gap-4">
                        <span className="h-px w-14 bg-sage-500" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-700">{t('pages.about.thinkTitle')}</span>
                    </div>
                    <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                        {think.map((item, index) => (
                            <motion.article
                                key={item.title}
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.35 }}
                                transition={{ duration: 0.42, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <p className="text-[11px] font-bold tracking-[0.14em] text-slate-400">{String(index + 1).padStart(2, '0')} —</p>
                                <h3 className="mt-2 text-[16px] font-bold leading-snug text-sage-700">{item.title}</h3>
                                <p className="mt-1 text-xs leading-6 text-slate-500">{item.description}</p>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </FadeInOnView>

            {/* Why We Exist */}
            <FadeInOnView>
                <div className="site-shell mt-20 border-t border-slate-100 pt-14">
                    <div className="mb-6 flex items-center gap-4">
                        <span className="h-px w-14 bg-sage-500" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-700">{t('pages.about.whyTitle')}</span>
                    </div>
                    <p className="max-w-2xl text-2xl font-medium leading-snug text-slate-800">{t('pages.about.whyLead')}</p>
                    <p className="mt-4 text-base font-semibold text-sage-700">{t('pages.about.whySub')}</p>
                </div>
            </FadeInOnView>
        </div>
    )
}

function ContactPage() {
    const { t } = useTranslation()
    const budgets = t('pages.contact.budgets', { returnObjects: true }) as string[]
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [statusText, setStatusText] = useState('')
    const [statusType, setStatusType] = useState<'idle' | 'success' | 'error'>('idle')
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contactNo: '',
        budget: '',
        message: '',
        company: '', // honeypot — should stay empty
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const resetForm = () =>
        setFormData({ name: '', email: '', contactNo: '', budget: '', message: '', company: '' })

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setStatusText('')
        setStatusType('idle')

        if (!formData.name.trim() || !formData.email.trim() || !formData.contactNo.trim() || !formData.budget.trim() || !formData.message.trim()) {
            setStatusType('error')
            setStatusText('Please complete all fields before submitting.')
            return
        }

        if (!EMAIL_REGEX.test(formData.email.trim())) {
            setStatusType('error')
            setStatusText('Please enter a valid email address.')
            return
        }

        if (!PHONE_REGEX.test(formData.contactNo.trim())) {
            setStatusType('error')
            setStatusText('Please enter a valid PH mobile number (e.g., 09452873791).')
            return
        }

        setIsSubmitting(true)

        try {
            const data = new FormData(e.currentTarget)
            data.append('access_key', import.meta.env.VITE_WEB3FORMS_KEY)
            data.append('subject', `New Inquiry from ${formData.name.trim()}`)
            data.append('from_name', 'Avillanosa IT Solutions')
            data.delete('company')

            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: data,
            })
            const result = await response.json()

            if (result.success) {
                setStatusType('success')
                setStatusText('Thanks! Your message has been sent. We will get back to you shortly.')
                resetForm()
            } else {
                throw new Error(result.message || 'Request failed')
            }
        } catch (error) {
            setStatusType('error')
            setStatusText(
                error instanceof Error && error.message !== 'Request failed'
                    ? error.message
                    : 'Something went wrong while sending. Please try again or email hello@itsavillanosa.com.',
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="py-20">
            <FadeInOnView>
                <div className="site-shell">
                    <div className="mb-8 flex items-center gap-4">
                        <span className="h-px w-14 bg-sage-500" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-700">{t('pages.contact.label')}</span>
                    </div>
                    <h1 className="max-w-2xl text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[1.08] tracking-tight text-slate-900">
                        {t('pages.contact.heroTitle')}
                    </h1>
                    <p className="mt-5 max-w-xl text-sm leading-7 text-slate-500">{t('pages.contact.subTitle')}</p>

                    <form className="mt-10 max-w-2xl" onSubmit={handleSubmit}>
                        {/* Honeypot: hidden from real users, catches bots */}
                        <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            tabIndex={-1}
                            autoComplete="off"
                            aria-hidden="true"
                            className="absolute -left-[9999px] h-0 w-0 opacity-0"
                        />
                        <div className="grid gap-3 sm:grid-cols-2">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder={t('pages.contact.form.name')}
                                className="rounded-none border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-sage-500 focus:outline-none focus:ring-1 focus:ring-sage-400"
                            />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                pattern={EMAIL_REGEX.source}
                                title="Enter a valid email address"
                                placeholder={t('pages.contact.form.email')}
                                className="rounded-none border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-sage-500 focus:outline-none focus:ring-1 focus:ring-sage-400"
                            />
                            <input
                                type="tel"
                                name="contactNo"
                                value={formData.contactNo}
                                onChange={handleChange}
                                pattern={PHONE_REGEX.source}
                                title="Use PH mobile format like 09452873791"
                                placeholder={t('pages.contact.form.contactNo')}
                                className="rounded-none border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-sage-500 focus:outline-none focus:ring-1 focus:ring-sage-400"
                            />
                            <select
                                name="budget"
                                value={formData.budget}
                                onChange={handleChange}
                                className="rounded-none border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-400 focus:border-sage-500 focus:outline-none focus:ring-1 focus:ring-sage-400"
                            >
                                <option value="" disabled>{t('pages.contact.form.budget')}</option>
                                {budgets.map((b) => (
                                    <option key={b} value={b} className="text-slate-800">{b}</option>
                                ))}
                            </select>
                        </div>

                        <textarea
                            rows={5}
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder={t('pages.contact.form.message')}
                            className="mt-3 w-full rounded-none border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-sage-500 focus:outline-none focus:ring-1 focus:ring-sage-400"
                        />

                        {statusText && (
                            <p className={`mt-4 text-sm ${statusType === 'success' ? 'text-sage-700' : 'text-red-600'}`}>
                                {statusText}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-5 bg-sage-800 px-8 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:bg-sage-700 transition"
                        >
                            {isSubmitting ? 'Sending...' : t('pages.contact.form.submit')}
                        </button>
                    </form>
                </div>
            </FadeInOnView>
        </div>
    )
}

function AppFooter() {
    const { t } = useTranslation()

    return (
        <footer className="site-shell pt-14 pb-10 text-slate-500">
            <p className="text-sm">
                &copy; {new Date().getFullYear()} {t('footer.copyright')}
            </p>
        </footer>
    )
}

function App() {
    const location = useLocation()
    const isHome = location.pathname === '/'
    const [isInquireOpen, setIsInquireOpen] = useState(false)

    if (isHome) {
        return (
            <div className="dark-landing">
                <SiteHeader />
                <main>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                    </Routes>
                </main>
            </div>
        )
    }

    return (
        <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">
                <Routes>
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/solutions" element={<SolutionsPage />} />
                    <Route path="/work" element={<WorkPage />} />
                    <Route path="/work/:projectSlug" element={<ProjectDetailsPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                </Routes>
            </main>
            <ContactBand onInquire={() => setIsInquireOpen(true)} />
            <AppFooter />
            {isInquireOpen && <InquireNowModal onClose={() => setIsInquireOpen(false)} />}
        </div>
    )
}

export default App
