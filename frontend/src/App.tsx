import {
    Button,
    Dropdown,
    DropdownItem,
    Navbar,
    NavbarBrand,
    NavbarCollapse,
    NavbarToggle,
} from 'flowbite-react'
import { ArrowRightAlt, Facebook, Instagram, Linkedin, Twitter } from 'flowbite-react-icons/solid'
import { motion } from 'framer-motion'
import { type ChangeEvent, type FormEvent, type ReactNode, useState } from 'react'
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
        thumbnail: '/rentalbasic.svg',
        gallery: ['/rentalbasic_website.png', '/rentalbasic.gif'],
        url: 'https://rentalbasic.com',
        isCurrent: true,
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

function SideSocialRail() {
    return (
        <aside className="fixed left-7 top-[28%] z-20 hidden lg:flex lg:flex-col lg:items-center lg:gap-4">
            <span className="rotate-180 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400 [writing-mode:vertical-lr]">
                Follow Us
            </span>
            <span className="h-12 w-px bg-sage-300" />
            <div className="flex flex-col items-center gap-3 text-slate-500">
                <a href="#" aria-label="Instagram" className="hover:text-sage-700"><Instagram size={14} /></a>
                <a href="#" aria-label="Facebook" className="hover:text-sage-700"><Facebook size={14} /></a>
                <a href="#" aria-label="LinkedIn" className="hover:text-sage-700"><Linkedin size={14} /></a>
            </div>
        </aside>
    )
}

function SiteHeader() {
    const location = useLocation()
    const { i18n, t } = useTranslation()

    const isActivePath = (path: string) => {
        if (path === '/') return location.pathname === '/'
        return location.pathname.startsWith(path)
    }

    const languageMenu = (
        <Dropdown label={t('language.current')} inline className="text-slate-700 text-base">
            <DropdownItem className="text-slate-800 hover:bg-sage-50" onClick={() => i18n.changeLanguage('en')}>
                {t('language.english')}
            </DropdownItem>
            <DropdownItem className="text-slate-800 hover:bg-sage-50" onClick={() => i18n.changeLanguage('fil')}>
                {t('language.filipino')}
            </DropdownItem>
        </Dropdown>
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
                <img src="/app_logo.png" alt="Avillanosa IT Solutions logo" className="h-8 w-8 object-contain" />
                <span className="self-center whitespace-nowrap text-[22px] font-semibold tracking-tight text-slate-600">ItsAvillanosa</span>
            </NavbarBrand>

            <div className="hidden md:flex md:flex-1 md:items-center md:justify-end md:gap-2">
                {renderNavLinks()}
                <div className="md:pl-3">{languageMenu}</div>
            </div>

            <div className="flex items-center gap-2 md:hidden">
                <div>{languageMenu}</div>
                <NavbarToggle />
            </div>

            <NavbarCollapse className="nav-caps !bg-transparent md:!hidden">
                {renderNavLinks()}
            </NavbarCollapse>
        </Navbar>
    )
}

function HeroSection() {
    const { t } = useTranslation()
    const offers = t('home.hero.offers', { returnObjects: true }) as string[]

    return (
        <FadeInOnView>
            <section className="site-shell pt-20">
                <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.12] tracking-tight text-sage-900 md:text-6xl">{t('home.hero.title')}</h1>
                <p className="mt-4 max-w-2xl text-sm text-slate-500">We craft clear, reliable digital products to elevate your brand and core operations.</p>

                <div className="mt-8 grid max-w-3xl gap-2 md:grid-cols-2">
                    {offers.map((offer) => (
                        <p key={offer} className="text-sm text-slate-600">
                            {offer}
                        </p>
                    ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                    <Button color="light" className="rounded-none border-0 !bg-slate-800 !text-white px-7 py-1 text-[11px] font-bold uppercase tracking-[0.14em] hover:!bg-slate-700">
                        {t('home.hero.actions.inquireNow')}
                    </Button>
                    <Button color="light" className="rounded-none border border-slate-200 !bg-white !text-slate-900 px-7 py-1 text-[11px] font-bold uppercase tracking-[0.14em] shadow-md hover:shadow-lg">
                        {t('home.hero.actions.getToKnowUs')}
                    </Button>
                </div>
            </section>
        </FadeInOnView>
    )
}

function WorkSection() {
    const { t } = useTranslation()

    return (
        <FadeInOnView>
            <section className="site-shell mt-28">
                <div className="mb-10 flex items-center gap-4">
                    <span className="h-px w-14 bg-sage-500" />
                    <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-700">{t('home.work.title')}</h2>
                </div>

                <div className="grid gap-x-5 gap-y-10 md:grid-cols-3">
                    {projectItems.map((item, index) => (
                        <motion.article
                            key={item.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {item.thumbnail ? (
                                <img
                                    src={item.thumbnail}
                                    alt={`${item.name} thumbnail`}
                                    className="aspect-[16/10] w-full rounded-sm object-cover ring-1 ring-slate-200"
                                />
                            ) : (
                                <div className={`aspect-[16/10] w-full rounded-sm bg-gradient-to-br ${item.accentClass} ring-1 ring-slate-200`} />
                            )}
                            <h3 className="mt-3 text-[14px] font-semibold text-slate-800">
                                {item.url ? (
                                    <a href={item.url} target="_blank" rel="noreferrer" className="hover:text-sage-700 hover:underline">
                                        {item.name}
                                    </a>
                                ) : (
                                    item.name
                                )}
                            </h3>
                            {item.isCurrent && (
                                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-sage-700">Current Project</p>
                            )}
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
                        </motion.article>
                    ))}
                </div>
            </section>
        </FadeInOnView>
    )
}

function ClientsWordsSection() {
    const { t } = useTranslation()
    const testimonials = t('home.clients.items', { returnObjects: true }) as Array<{ quote: string; author: string }>

    return (
        <FadeInOnView>
            <section className="site-shell mt-24">
                <h2 className="text-4xl font-bold tracking-tight text-slate-900">{t('home.clients.title')}</h2>

                <div className="mt-10 grid gap-10 md:grid-cols-2">
                    {testimonials.map((item, index) => (
                        <motion.article
                            key={`${item.author}-${index}`}
                            className="rounded-sm border border-slate-200 bg-white p-8"
                            initial={{ opacity: 0, y: 22 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <p className="text-sm leading-7 text-slate-600">{item.quote}</p>
                            <p className="mt-6 text-sm font-semibold text-slate-900">{item.author}</p>
                        </motion.article>
                    ))}
                </div>
            </section>
        </FadeInOnView>
    )
}

function ContactBand() {
    const { t } = useTranslation()

    return (
        <FadeInOnView>
            <section className="site-shell mt-24 border-t border-slate-200 pt-20">
                <div className="grid gap-x-6 gap-y-16 md:grid-cols-12">
                    <div className="min-w-0 md:col-span-4">
                        <p className="text-xs text-slate-400">Email</p>
                        <p className="mt-3 break-words text-2xl leading-tight font-medium tracking-tight text-slate-800 md:text-[30px]">
                            careers.kmavillanosa@gmail.com
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
                            <a href="#" aria-label="Facebook" className="hover:text-sage-700"><Facebook size={24} /></a>
                            <a href="#" aria-label="Twitter" className="hover:text-sage-700"><Twitter size={24} /></a>
                            <a href="#" aria-label="Instagram" className="hover:text-sage-700"><Instagram size={24} /></a>
                            <a href="#" aria-label="LinkedIn" className="hover:text-sage-700"><Linkedin size={24} /></a>
                        </div>

                        <Button color="light" className="mt-14 w-full rounded-none border-0 !bg-sage-400 !text-white px-10 py-3 text-sm font-bold uppercase tracking-[0.16em] hover:!bg-sage-500 md:w-[300px]">
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
            <SideSocialRail />
            <HeroSection />
            <WorkSection />
            <ClientsWordsSection />
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
                        <motion.article
                            key={service}
                            className="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <img
                                src={getServiceThumbnail(service)}
                                alt={`${service} service`}
                                className="aspect-[16/10] w-full object-cover"
                            />
                            <div className="p-4">
                                <h2 className="text-base font-semibold text-slate-800">{service}</h2>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </section>
        </FadeInOnView>
    )
}

function SolutionsPage() {
    return (
        <FadeInOnView>
            <section className="site-shell py-24">
                <h1 className="text-5xl font-bold tracking-tight text-slate-900">Solutions</h1>
                <p className="mt-4 max-w-3xl text-slate-600">Products and platforms we are building to solve real operational problems.</p>

                <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                    {projectItems.map((item) => (
                        <article key={item.slug} className="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm">
                            {item.thumbnail ? (
                                <img src={item.thumbnail} alt={`${item.name} solution`} className="aspect-[16/10] w-full object-cover" />
                            ) : (
                                <div className={`aspect-[16/10] w-full bg-gradient-to-br ${item.accentClass}`} />
                            )}

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
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setStatusText('')
        setStatusType('idle')

        const payload = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            contactNo: formData.contactNo.trim(),
            budget: formData.budget.trim(),
            message: formData.message.trim(),
        }

        if (!payload.name || !payload.email || !payload.contactNo || !payload.budget || !payload.message) {
            setStatusType('error')
            setStatusText('Please complete all fields before submitting.')
            return
        }

        if (!EMAIL_REGEX.test(payload.email)) {
            setStatusType('error')
            setStatusText('Please enter a valid email address.')
            return
        }

        if (!PHONE_REGEX.test(payload.contactNo)) {
            setStatusType('error')
            setStatusText('Please enter a valid PH mobile number (e.g., 09452873791).')
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch('https://api.rentalbasic.com/notifications/email/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: 'careers.kmavillanosa@gmail.com',
                    subject: `New Inquiry from ${payload.name}`,
                    html: `<h2>New Contact Inquiry</h2>
<p><strong>Name:</strong> ${payload.name}</p>
<p><strong>Email:</strong> ${payload.email}</p>
<p><strong>Contact No.:</strong> ${payload.contactNo}</p>
<p><strong>Budget:</strong> ${payload.budget}</p>
<p><strong>Message:</strong></p>
<p>${payload.message.replace(/\n/g, '<br/>')}</p>`,
                }),
            })

            if (!response.ok) {
                throw new Error('Unable to send message right now.')
            }

            setStatusType('success')
            setStatusText('Your inquiry has been sent. We will contact you shortly.')
            setFormData({
                name: '',
                email: '',
                contactNo: '',
                budget: '',
                message: '',
            })
        } catch {
            setStatusType('error')
            setStatusText('Failed to send inquiry. Please try again in a few moments.')
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
    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/solutions" element={<SolutionsPage />} />
                    <Route path="/work" element={<WorkSection />} />
                    <Route path="/work/:projectSlug" element={<ProjectDetailsPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                </Routes>
            </main>
            <ContactBand />
            <AppFooter />
        </div>
    )
}

export default App
