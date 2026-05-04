"use client";
import Language from '@/components/ms-language/Language';
import Presentation from '@/components/ms-presentation/Presentation';

export default function LandingPage() {
  return (
    <>
      <div className="presentation-header">
        <Language />
      </div>
      <Presentation />
    </>
  );
}