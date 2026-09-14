import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { TESTIMONIAL_DATA } from '../data/products';
import { TestimonialItem } from '../types';

interface TestimonialProps {
  content?: TestimonialItem;
}

export const Testimonial: React.FC<TestimonialProps> = ({ content }) => {
  const quote = content?.quote || TESTIMONIAL_DATA.quote;
  const author = content?.author || TESTIMONIAL_DATA.author;
  const role = content?.role || TESTIMONIAL_DATA.role;
  const rating = content?.rating || TESTIMONIAL_DATA.rating;
  const location = content?.location || TESTIMONIAL_DATA.location;
  const productUsed = content?.productUsed || TESTIMONIAL_DATA.productUsed;
  const avatarUrl = content?.avatarUrl || TESTIMONIAL_DATA.avatarUrl;

  return (
    <section
      id="testimonios"
      className="py-16 lg:py-24 bg-white border-y border-[#e8ddca] relative overflow-hidden"
    >
      {/* Soft background foliage glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#6F9E73]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Label matching Wireframe */}
        <div className="text-center mb-10">
          <span className="text-xs font-montserrat font-bold uppercase tracking-widest text-[#C97852] block mb-2">
            TESTIMONIO
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-montserrat text-[#285943] tracking-tight">
            Lo que dicen de nosotros
          </h2>
        </div>

        {/* Testimonial Card */}
        <div
          id="testimonial-card"
          className="bg-[#FAF6F0] rounded-2xl sm:rounded-3xl p-8 sm:p-12 border border-[#e8ddca] shadow-sm relative text-center flex flex-col items-center"
        >
          {/* Botanical Quote icon in terracotta */}
          <div className="w-14 h-14 rounded-full bg-[#C97852]/15 flex items-center justify-center text-[#C97852] mb-6">
            <Quote className="w-7 h-7" />
          </div>

          {/* Rating Stars */}
          <div className="flex items-center justify-center gap-1 text-[#C97852] mb-6">
            {[...Array(rating || 5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-[#C97852]" />
            ))}
          </div>

          {/* Emotional quote in Lora font */}
          <blockquote className="font-lora text-lg sm:text-xl md:text-2xl italic font-normal text-[#285943] leading-relaxed max-w-3xl mb-8">
            {quote}
          </blockquote>

          {/* Author Details */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-[#e8ddca] w-full max-w-md justify-center">
            <img
              src={avatarUrl}
              alt={author}
              className="w-14 h-14 rounded-full object-cover border-2 border-[#6F9E73] shadow-xs"
              referrerPolicy="no-referrer"
            />
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1.5">
                <h4 className="font-montserrat font-bold text-base text-[#285943]">
                  {author}
                </h4>
                <span title="Comprador verificado" className="inline-flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-[#6F9E73]" />
                </span>
              </div>
              <p className="text-xs font-montserrat text-[#285943]/75 font-medium">
                {role} • {location}
              </p>
              {productUsed && (
                <span className="inline-block text-[11px] font-montserrat text-[#C97852] font-semibold mt-0.5">
                  {productUsed}
                </span>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
