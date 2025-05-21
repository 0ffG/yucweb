"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface School {
  id: number;
  name: string;
}

export default function AllSchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // SQL'den okul verilerini al
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await fetch("/api/schools", { credentials: "include" });
        const data = await res.json();
        setSchools(data);
      } catch (err) {
        console.error("Okullar alınamadı:", err);
      }
    };
    fetchSchools();
  }, []);

  // Arama formu gönderildiğinde
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      setFilteredSchools(null);
      return;
    }

    const matched = schools.filter((school) =>
      school.name.toLowerCase().includes(query)
    );
    setFilteredSchools(matched.length ? matched : []);
  };

  // Gösterilecek okulları belirle
  const displayedSchools = filteredSchools ?? schools;

  return (
    <div className="flex min-h-screen flex-col bg-cover bg-center bg-[url('/arkaplan.jpg')]">
      <main className="flex flex-1 flex-col items-center justify-center px-8 py-8">
        <form onSubmit={handleSearch} className="mb-6 w-full max-w-2xl flex">
          <input
            type="text"
            name="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Okul adı ara..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Ara
          </button>
        </form>

        {displayedSchools.length === 0 ? (
          <p className="text-white">Okul bulunamadı.</p>
        ) : (
          <ul className="space-y-6 w-full max-w-2xl">
            {displayedSchools.map((school) => (
              <li key={school.id}>
                <Link
                  href={`/schools/${school.id}`}
                  className="flex w-full items-center space-x-4 rounded-2xl border border-gray-300 bg-white px-6 py-4 shadow hover:bg-gray-100"
                >
                  <div className="h-20 w-20 flex-shrink-0 rounded bg-gray-200">
                    <img
                      src="/classroom.jpg"
                      alt={`${school.name} resmi`}
                      className="h-full w-full rounded object-cover"
                    />
                  </div>
                  <div className="flex flex-col flex-grow">
                    <span className="text-lg font-bold text-black">{school.name}</span>
                    <span className="text-sm text-gray-700">Profili Gör</span>
                  </div>
                  <div className="text-gray-500">&gt;</div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
