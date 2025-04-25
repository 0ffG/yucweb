"use client";

import { FormEvent, useRef } from "react";
import Link from "next/link";

export default function AllSchoolsPage() {
  const schools = [
    "Örnek İlkokulu",
    "Yeni Nesil Okulu",
    "Umut Ortaokulu",
    "Mutlu Ortaokulu",
    "Dost İlkokulu",
  ];

  const schoolRefs = useRef<(HTMLLIElement | null)[]>([]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const searchValue = (form.elements.namedItem("search") as HTMLInputElement).value.trim();
    const index = schools.findIndex(
      (school) => school.toLowerCase() === searchValue.toLowerCase()
    );
    if (index !== -1 && schoolRefs.current[index]) {
      schoolRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="flex min-h-screen flex-col bg-cover bg-center bg-[url('/arkaplan.jpg')] bg-opacity-50"
    >
      <main className="flex flex-1 flex-col items-center justify-center px-8 py-8">
        <form onSubmit={handleSearch} className="mb-6 w-full max-w-2xl">
          <input
            type="text"
            name="search"
            placeholder="Okul adı ara..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Ara
          </button>
        </form>

        <ul className="space-y-6 w-full max-w-2xl">
          {schools.map((school, index) => (
            <li
              key={index}
              ref={(el) => {
                schoolRefs.current[index] = el;
              }}
            >
              <Link
                href={`/schools/${index + 1}`}
                className="flex w-full items-center space-x-4 rounded-2xl border border-gray-300 bg-white px-6 py-4 shadow hover:bg-gray-100"
              >
                {/* Sol tarafta resim */}
                <div className="h-20 w-20 flex-shrink-0 rounded bg-gray-200">
                  <img
                    src="/classroom.jpg"
                    alt={`${school} resmi`}
                    className="h-full w-full rounded object-cover"
                  />
                </div>
                {/* Okul adı ve yazı */}
                <div className="flex flex-col flex-grow">
                  <span className="text-lg font-bold text-black">{school}</span>
                  <span className="text-sm text-gray-700">Profili Gör</span>
                </div>
                <div className="text-gray-500">&gt;</div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
