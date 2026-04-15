import { UploadIcon, VideoIcon, ZapIcon } from 'lucide-react';

export const featuresData = [
    {
        icon: <UploadIcon className="w-6 h-6" />,
        title: 'Smart Upload',
        desc: 'Drag & drop your assets. We auto-optimize formats and sizes'
    },
    {
        icon: <ZapIcon className="w-6 h-6" />,
        title: 'Instant Generation',
        desc: 'High-quality design and scalable development focused on performance and usability.'
    },
    {
        icon: <VideoIcon className="w-6 h-6" />,
        title: 'UGC Video Ad Templates',
        desc: 'Get ready-to-use formats like testimonial, unboxing, problem-solution, and before-after.'
    }
];

export const plansData = [
    {
        id: 'starter',
        name: 'Starter',
        price: '$20',
        desc: 'Try the platform at no cost',
        credits: 25,
        features: [
            '25 credits',
            'Standard quality',
            'No watermark',
            'Slower generation speed',
            'Email support'
        ]
    },
    {
        id: 'pro',
        name: 'Pro',
        price: '$29',
        desc: 'Creators & small teams',
        credits: 80,
        features: [
            "80 credits" ,
             "HD quality" ,
            "No watermark" ,
            "Video generation" ,
            "Priority Support for users"
        ],
        popular: true
    },
    {
        id: 'ultra',
        name: 'Ultra',
        price: '$99',
        desc: 'Scale across teams and agencies',
        credits: 'Custom',
        features: [
            "300 credits",
            "FHD quality",
            "No watermark",
            "Fast generation speed",
            "Priority Support for users",
        ]
    }
];

export const faqData = [
    {
    question: "What is UGC AI Ads Generator?",
    answer:
      "UGC AI Ads Generator is a tool that helps you create high-converting UGC ad scripts instantly. It generates hooks, video scripts, captions, and CTAs tailored to your product and audience.",
  },
  {
    question: "Do I need marketing experience to use it?",
    answer:
      "No. The app is beginner-friendly and guides you through the process. Just enter your product details and the AI will generate ad-ready content in seconds.",
  },
  {
    question: "What type of ads can I generate?",
    answer:
      "You can generate UGC ad formats like testimonials, problem-solution, unboxing, before-after, and founder-style ads with multiple hook variations.",
  },
  {
    question: "Can I customize the tone and style of ads?",
    answer:
      "Yes. You can choose different tones like professional, casual, energetic, or Gen-Z, and regenerate multiple variations until it matches your brand voice.",
  },
  {
    question: "Is the generated content ready to use?",
    answer:
      "Yes. Every output is structured and ad-ready, including a strong hook, key benefits, objections, and a clear call-to-action so you can record or edit quickly.",
  },
];

export const footerLinks = [
    {
        title: "Quick Links",
        links: [
            { name: "Home", url: "#" },
            { name: "Services", url: "#" },
            { name: "Work", url: "#" },
            { name: "Contact", url: "#" }
        ]
    },
    {
        title: "Legal",
        links: [
            { name: "Privacy Policy", url: "#" },
            { name: "Terms of Service", url: "#" }
        ]
    },
    {
        title: "Connect",
        links: [
            { name: "Twitter", url: "#" },
            { name: "LinkedIn", url: "#" },
            { name: "GitHub", url: "#" }
        ]
    }
];