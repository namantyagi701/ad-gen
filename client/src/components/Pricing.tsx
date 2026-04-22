
import Title from './Title';
import { PricingTable } from '@clerk/clerk-react';

export default function Pricing() {
    return (
        <section id="pricing" className="py-20 bg-black/2 border-t border-black/6">
            <div className="max-w-6xl mx-auto px-4">

                <Title
                    title="Pricing"
                    heading="Pricing plans"
                    description="Opt according to your needs"
                />

                <div className="flex flex-wrap items-center justify-center max-w-5xl mx-auto">
                    <PricingTable appearance={{
                        variables:{
                            colorBackground: '#ffffff',
                            colorText: '#111111',
                            colorTextSecondary: '#555555',
                        },
                        elements:{
                            pricingTableCardBody : 'bg-white border border-black/8 text-gray-900',
                            pricingTableCardHeader : 'bg-gray-50 text-gray-900',
                        }
                    }}/>
                </div>
            </div>
        </section>
    );
};