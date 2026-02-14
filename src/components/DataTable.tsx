import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle, Radiation, XCircle, Mail, Edit, ArrowUpDown } from "lucide-react";

import ageData from "@/data/age.json";
import gobiernoData from "@/data/gobierno.json";
import congresoData from "@/data/congreso.json";
import senadoData from "@/data/senado.json";
import partidosData from "@/data/partidos.json";
import autonomiasData from "@/data/autonomias.json";
import universidadesData from "@/data/universidades.json";

const TwitterIcon = ({ handle, activo }: { handle?: string | null; activo?: boolean }) => {
  const hasAccount = !!handle;

  let icon;
  if (!hasAccount || !activo) {
    icon = <Radiation className="h-5 w-5 text-emerald-600" />;
  } else {
    icon = <Radiation className="h-5 w-5 text-red-500" />;
  }

  if (hasAccount) {
    return (
      <a
        href={`https://twitter.com/${handle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block hover:opacity-70 transition-opacity"
      >
        {icon}
      </a>
    );
  }
  return icon;
};

const BlueskyIcon = ({ handle, activo }: { handle?: string | null; activo?: boolean }) => {
  const hasAccount = !!handle;

  let icon;
  if (!hasAccount) {
    icon = <XCircle className="h-5 w-5 text-slate-300" />;
  } else if (!activo) {
    icon = <CheckCircle className="h-5 w-5 text-amber-400" />;
  } else {
    icon = <CheckCircle className="h-5 w-5 text-emerald-600" />;
  }

  if (hasAccount) {
    return (
      <a
        href={`https://bsky.app/profile/${handle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block hover:opacity-70 transition-opacity"
      >
        {icon}
      </a>
    );
  }
  return icon;
};

const MastodonIcon = ({ handle, activo }: { handle?: string | null; activo?: boolean }) => {
  const hasAccount = !!handle;

  let icon;
  if (!hasAccount) {
    icon = <XCircle className="h-5 w-5 text-red-500" />;
  } else if (!activo) {
    icon = <CheckCircle className="h-5 w-5 text-amber-400" />;
  } else {
    icon = <CheckCircle className="h-5 w-5 text-emerald-600" />;
  }

  if (hasAccount) {
    return (
      <a
        href={handle}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block hover:opacity-70 transition-opacity"
      >
        {icon}
      </a>
    );
  }
  return icon;
};

function normalizeData(data: any[], categoria: string) {
  return data.map((item) => {
    let detalle = '';

    if (categoria === 'Congreso' || categoria === 'Senado') {
      detalle = item.grupo || '';
    } else if (categoria === 'AGE') {
      detalle = item.categoria || '';
    } else if (categoria === 'Gobierno') {
      detalle = item.cargo || '';
    } else if (categoria === 'Partidos') {
      detalle = item.ambito || 'Nacional';
    } else if (categoria === 'Autonomías') {
      detalle = item.partido || '';
    } else if (categoria === 'Universidades') {
      detalle = item.tipo || 'Pública';
    } else {
      detalle = item.categoria || item.cargo || item.tipo || '';
    }

    return {
      nombre: (item.nombre || '').trim(),
      detalle,
      categoria,
      twitter: item.twitter || null,
      twitter_activo: item.twitter_activo || false,
      bluesky: item.bluesky || null,
      bluesky_activo: item.bluesky_activo || false,
      mastodon: item.mastodon || null,
      mastodon_activo: item.mastodon_activo || false,
      email: item.email || null,
      raw: item,
    };
  });
}

const FALLBACK_EMAILS: Record<string, string> = {
  'AGE': 'informacion@administracion.gob.es',
  'Gobierno': 'presidencia@lamoncloa.gob.es',
  'Congreso': 'congreso@congreso.es',
  'Senado': 'senado@senado.es',
  'Partidos': 'info@partido.es',
  'Autonomías': 'comunicacion@gobierno.regional.es',
  'Universidades': 'informacion@universidad.es',
};

export function DataTable() {
  const [activeTab, setActiveTab] = useState("age");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const handleTabChange = (e: any) => setActiveTab(e.detail);
    const handleSearchChange = (e: any) => setSearchQuery(e.detail);

    window.addEventListener("tab-change", handleTabChange);
    window.addEventListener("search-change", handleSearchChange);

    return () => {
      window.removeEventListener("tab-change", handleTabChange);
      window.removeEventListener("search-change", handleSearchChange);
    };
  }, []);

  const allDataByCategory = useMemo(() => ({
    age: normalizeData(ageData, 'AGE'),
    gobierno: normalizeData(gobiernoData, 'Gobierno'),
    congreso: normalizeData(congresoData, 'Congreso'),
    senado: normalizeData(senadoData, 'Senado'),
    partidos: normalizeData(partidosData, 'Partidos'),
    autonomias: normalizeData(autonomiasData, 'Autonomías'),
    universidades: normalizeData(universidadesData, 'Universidades'),
  }), []);

  const allData = useMemo(() => Object.values(allDataByCategory).flat(), [allDataByCategory]);

  const rawData = useMemo(() => {
    if (activeTab === 'total') return allData;
    return allDataByCategory[activeTab as keyof typeof allDataByCategory] || allData;
  }, [activeTab, allData, allDataByCategory]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return rawData;
    const query = searchQuery.toLowerCase();
    return rawData.filter((item) =>
      [item.nombre, item.detalle, item.categoria].some(
        (field) => field && field.toLowerCase().includes(query)
      )
    );
  }, [rawData, searchQuery]);

  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (sortColumn === 'twitter') {
        aValue = a.twitter_activo ? 1 : 0;
        bValue = b.twitter_activo ? 1 : 0;
      } else if (sortColumn === 'bluesky') {
        aValue = a.bluesky_activo ? 1 : (a.bluesky ? 0.5 : 0);
        bValue = b.bluesky_activo ? 1 : (b.bluesky ? 0.5 : 0);
      } else if (sortColumn === 'mastodon') {
        aValue = a.mastodon_activo ? 1 : (a.mastodon ? 0.5 : 0);
        bValue = b.mastodon_activo ? 1 : (b.mastodon ? 0.5 : 0);
      } else {
        aValue = a[sortColumn as keyof typeof a];
        bValue = b[sortColumn as keyof typeof b];
      }

      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';

      if (typeof aValue !== 'number') aValue = String(aValue).toLowerCase();
      if (typeof bValue !== 'number') bValue = String(bValue).toLowerCase();

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  useEffect(() => {
    const stats = calculateStats(rawData);
    window.dispatchEvent(new CustomEvent('stats-change', { detail: stats }));
  }, [rawData]);

  const generateMailto = (item: any) => {
    const email = item.email || FALLBACK_EMAILS[item.categoria] || 'info@gobierno.es';
    const subject = encodeURIComponent('Solicitud de migración a redes federadas');
    const body = encodeURIComponent(
      `Estimado/a responsable de ${item.nombre},\n\n` +
      `Me pongo en contacto para solicitar que ${item.nombre} considere establecer presencia en redes sociales federadas como Mastodon o Bluesky.\n\n` +
      `Las instituciones públicas democráticas deberían comunicarse a través de plataformas que respeten los valores democráticos y no estén controladas por oligarcas.\n\n` +
      `Atentamente,`
    );
    return `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="w-full relative">
      <div className="mb-4 text-sm text-slate-600">
        Mostrando {sortedData.length} de {rawData.length} entidades
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-slate-50"
                onClick={() => handleSort('nombre')}
              >
                <div className="flex items-center gap-1">
                  Nombre
                  <ArrowUpDown className="h-3 w-3" />
                  {sortColumn === 'nombre' && (
                    <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-slate-50 text-center hidden md:table-cell"
                onClick={() => handleSort('detalle')}
              >
                <div className="flex items-center justify-center gap-1">
                  Detalle
                  <ArrowUpDown className="h-3 w-3" />
                  {sortColumn === 'detalle' && (
                    <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-slate-50 text-center"
                onClick={() => handleSort('twitter')}
              >
                <div className="flex items-center justify-center gap-1">
                  <span className="hidden sm:inline">X</span>
                  <ArrowUpDown className="h-3 w-3" />
                  {sortColumn === 'twitter' && (
                    <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-slate-50 text-center"
                onClick={() => handleSort('bluesky')}
              >
                <div className="flex items-center justify-center gap-1">
                  <span className="hidden sm:inline">Bluesky</span>
                  <ArrowUpDown className="h-3 w-3" />
                  {sortColumn === 'bluesky' && (
                    <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-slate-50 text-center"
                onClick={() => handleSort('mastodon')}
              >
                <div className="flex items-center justify-center gap-1">
                  <span className="hidden sm:inline">Mastodon</span>
                  <ArrowUpDown className="h-3 w-3" />
                  {sortColumn === 'mastodon' && (
                    <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </TableHead>
              <TableHead className="text-center">
                <span className="hidden sm:inline">Acción</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedData.length > 0 ? (
              sortedData.map((item, index) => (
                <TableRow
                  key={index}
                  id={`table-row-${index}`}
                  className="group"
                  onMouseEnter={(e) => {
                    const btn = document.getElementById(`edit-btn-${index}`);
                    if (btn && window.innerWidth >= 768) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      btn.style.top = `${rect.top + rect.height / 2}px`;
                      btn.style.left = `${rect.right + 8}px`;
                      btn.style.opacity = '1';
                      btn.style.pointerEvents = 'auto';
                      const timeoutId = btn.getAttribute('data-timeout-id');
                      if (timeoutId) clearTimeout(parseInt(timeoutId));
                    }
                  }}
                  onMouseLeave={() => {
                    const btn = document.getElementById(`edit-btn-${index}`);
                    if (btn && window.innerWidth >= 768) {
                      const timeoutId = setTimeout(() => {
                        btn.style.opacity = '0';
                        btn.style.pointerEvents = 'none';
                      }, 100);
                      btn.setAttribute('data-timeout-id', timeoutId.toString());
                    }
                  }}
                >
                  <TableCell className="font-medium text-left max-w-md">
                    <div className="truncate text-sm sm:text-base">
                      {item.nombre}
                    </div>
                  </TableCell>

                  <TableCell className="text-sm text-slate-600 text-center max-w-xs hidden md:table-cell">
                    <div className="truncate">
                      {item.detalle}
                    </div>
                  </TableCell>

                  <TableCell className="text-center align-middle">
                    <div className="flex items-center justify-center">
                      <TwitterIcon handle={item.twitter} activo={item.twitter_activo} />
                    </div>
                  </TableCell>

                  <TableCell className="text-center align-middle">
                    <div className="flex items-center justify-center">
                      <BlueskyIcon handle={item.bluesky} activo={item.bluesky_activo} />
                    </div>
                  </TableCell>

                  <TableCell className="text-center align-middle">
                    <div className="flex items-center justify-center">
                      <MastodonIcon handle={item.mastodon} activo={item.mastodon_activo} />
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-2 sm:px-4 whitespace-nowrap"
                      asChild
                    >
                      <a href={generateMailto(item)}>
                        <Mail className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Exigir migración</span>
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                  No se encontraron resultados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {sortedData.map((item, index) => (
        <div
          key={`edit-${index}`}
          id={`edit-btn-${index}`}
          className="fixed opacity-0 pointer-events-none transition-opacity duration-200 z-50 -translate-y-1/2 hidden md:block"
          style={{ top: 0, left: 0 }}
          onMouseEnter={(e) => {
            const btn = e.currentTarget;
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
            const timeoutId = btn.getAttribute('data-timeout-id');
            if (timeoutId) clearTimeout(parseInt(timeoutId));
          }}
          onMouseLeave={(e) => {
            const btn = e.currentTarget;
            btn.style.opacity = '0';
            btn.style.pointerEvents = 'none';
          }}
        >
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 bg-white hover:shadow-xl"
            onClick={() => {
              console.log('Editar:', item);
            }}
          >
            <Edit className="h-4 w-4 text-slate-600" />
          </Button>
        </div>
      ))}
    </div>
  );
}

export function calculateStats(data: any[]) {
  const total = data.length;
  if (total === 0) {
    return { enX: 0, fueraDeX: 0, mastodon: 0, bluesky: 0, sinAlternativa: 0 };
  }

  let enX = 0;
  let fueraDeX = 0;
  let mastodon = 0;
  let bluesky = 0;
  let sinAlternativa = 0;

  data.forEach(item => {
    const twitterActivo = item.twitter_activo || false;
    const mastodonActivo = item.mastodon_activo || false;
    const blueskyActivo = item.bluesky_activo || false;

    if (twitterActivo) {
      enX++;
    } else {
      fueraDeX++;
    }

    if (mastodonActivo) {
      mastodon++;
    } else if (blueskyActivo) {
      bluesky++;
    } else {
      sinAlternativa++;
    }
  });

  return { enX, fueraDeX, mastodon, bluesky, sinAlternativa };
}
