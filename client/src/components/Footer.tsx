import { assets } from '../assets/assets';
import { footerLinks } from '../assets/dummy-data';
import { motion } from 'framer-motion';

export default function Footer() {

    return (
        <motion.footer className="bg-gray-950 border-t border-gray-800 pt-10 text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 0.5 }}
        >
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-800">
                    <div>
                        <img src={assets.logo} alt="logo" className="h-12 invert" />
                        <p className="max-w-[410px] mt-6 text-sm leading-relaxed">
                            We are a digital agency focused on utilising AI.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
                        {footerLinks.map((section, index) => (
                            <div key={index}>
                                <h3 className="font-semibold text-base text-white md:mb-5 mb-2">
                                    {section.title}
                                </h3>
                                <ul className="text-sm space-y-1">
                                    {section.links.map(
                                        (link: { name: string; url: string }, i) => (
                                            <li key={i}>
                                                <a
                                                    href={link.url}
                                                    className="hover:text-white transition"
                                                >
                                                    {link.name}
                                                </a>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="py-4 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} {' '}
                    . All rights reserved.
                </p>
            </div>
        </motion.footer>
    );
};