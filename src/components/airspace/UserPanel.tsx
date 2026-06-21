"use client";

import { useEffect, useState } from "react";

// Local storage keys
const LS_SAVED_ZONES = "airspace_saved_zones";
const LS_FAVORITES = "airspace_favorites";
const LS_USER_PROFILE = "airspace_user_profile";

export interface SavedZone {
  id: string;
  name: string;
  features: any[]; // GeoJSON features
  createdAt: string;
  color: string;
}

export interface FavoriteLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  zoom: number;
  createdAt: string;
  note?: string;
}

export interface UserProfile {
  displayName: string;
  role: "pilot" | "operator" | "enthusiast" | "other";
  homeBase?: string;
  createdAt: string;
}

// Storage helpers
export function getSavedZones(): SavedZone[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(LS_SAVED_ZONES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveZone(zone: SavedZone): void {
  const zones = getSavedZones();
  zones.push(zone);
  localStorage.setItem(LS_SAVED_ZONES, JSON.stringify(zones));
}

export function deleteSavedZone(id: string): void {
  const zones = getSavedZones().filter((z) => z.id !== id);
  localStorage.setItem(LS_SAVED_ZONES, JSON.stringify(zones));
}

export function getFavorites(): FavoriteLocation[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(LS_FAVORITES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addFavorite(loc: FavoriteLocation): void {
  const favs = getFavorites();
  favs.push(loc);
  localStorage.setItem(LS_FAVORITES, JSON.stringify(favs));
}

export function removeFavorite(id: string): void {
  const favs = getFavorites().filter((f) => f.id !== id);
  localStorage.setItem(LS_FAVORITES, JSON.stringify(favs));
}

export function getUserProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(LS_USER_PROFILE);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(LS_USER_PROFILE, JSON.stringify(profile));
}

// Color palette for saved zones
const ZONE_COLORS = [
  "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#009688",
  "#4caf50", "#ff9800", "#f44336", "#e91e63", "#795548",
];

interface UserPanelProps {
  visible: boolean;
  onClose: () => void;
  onFlyTo: (lat: number, lng: number, zoom?: number) => void;
  onLoadZone: (features: any[]) => void;
  currentCustomFeatures: any[];
  getMapCenter: () => { lat: number; lng: number; zoom: number } | null;
}

export function UserPanel({ visible, onClose, onFlyTo, onLoadZone, currentCustomFeatures, getMapCenter }: UserPanelProps) {
  const [tab, setTab] = useState<"profile" | "zones" | "favorites">("profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [savedZones, setSavedZones] = useState<SavedZone[]>([]);
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<UserProfile["role"]>("pilot");
  const [editHomeBase, setEditHomeBase] = useState("");
  const [saving, setSaving] = useState(false);
  const [newFavName, setNewFavName] = useState("");
  const [newFavNote, setNewFavNote] = useState("");
  const [newZoneName, setNewZoneName] = useState("");

  // Load data when panel opens
  useEffect(() => {
    if (!visible) return;
    setSavedZones(getSavedZones());
    setFavorites(getFavorites());
    const p = getUserProfile();
    if (p) {
      setProfile(p);
      setEditName(p.displayName);
      setEditRole(p.role);
      setEditHomeBase(p.homeBase || "");
    }
  }, [visible]);

  if (!visible) return null;

  const handleSaveProfile = () => {
    const newProfile: UserProfile = {
      displayName: editName || "Anonymous Pilot",
      role: editRole,
      homeBase: editHomeBase || undefined,
      createdAt: profile?.createdAt || new Date().toISOString(),
    };
    saveUserProfile(newProfile);
    setProfile(newProfile);
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  const handleSaveCurrentZone = () => {
    if (!newZoneName.trim() || currentCustomFeatures.length === 0) return;
    const zone: SavedZone = {
      id: `zone_${Date.now()}`,
      name: newZoneName,
      features: currentCustomFeatures,
      createdAt: new Date().toISOString(),
      color: ZONE_COLORS[savedZones.length % ZONE_COLORS.length],
    };
    saveZone(zone);
    setSavedZones(getSavedZones());
    setNewZoneName("");
  };

  const handleDeleteZone = (id: string) => {
    deleteSavedZone(id);
    setSavedZones(getSavedZones());
  };

  const handleAddFavorite = () => {
    if (!newFavName.trim()) return;
    const center = getMapCenter();
    if (!center) return;
    const loc: FavoriteLocation = {
      id: `fav_${Date.now()}`,
      name: newFavName,
      lat: center.lat,
      lng: center.lng,
      zoom: center.zoom,
      createdAt: new Date().toISOString(),
      note: newFavNote || undefined,
    };
    addFavorite(loc);
    setFavorites(getFavorites());
    setNewFavName("");
    setNewFavNote("");
  };

  const handleRemoveFavorite = (id: string) => {
    removeFavorite(id);
    setFavorites(getFavorites());
  };

  const roleLabels: Record<UserProfile["role"], string> = {
    pilot: "Drone Pilot",
    operator: "Operator",
    enthusiast: "Aviation Enthusiast",
    other: "Other",
  };

  return (
    <div className="absolute top-20 left-4 z-20 w-80 max-h-[75vh]">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-indigo-200 overflow-hidden flex flex-col max-h-[75vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-indigo-50 border-b border-indigo-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-indigo-800">
              {profile?.displayName || "My Profile"}
            </span>
          </div>
          <button onClick={onClose} className="text-indigo-400 hover:text-indigo-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 flex-shrink-0">
          {[
            { id: "profile" as const, label: "Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
            { id: "zones" as const, label: "Zones", icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" },
            { id: "favorites" as const, label: "Favorites", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2.5 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                tab === t.id
                  ? "text-indigo-700 border-b-2 border-indigo-600 bg-indigo-50/50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={t.icon} />
              </svg>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-4">
          {/* Profile Tab */}
          {tab === "profile" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Display Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as UserProfile["role"])}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-indigo-300 outline-none"
                >
                  {Object.entries(roleLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Home Base (ICAO)</label>
                <input
                  type="text"
                  value={editHomeBase}
                  onChange={(e) => setEditHomeBase(e.target.value.toUpperCase())}
                  placeholder="e.g., VIDP"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200 outline-none font-mono"
                />
              </div>
              <button
                onClick={handleSaveProfile}
                className={`w-full py-2.5 text-sm font-medium rounded-lg transition-all ${
                  saving
                    ? "bg-green-500 text-white"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {saving ? "Saved!" : "Save Profile"}
              </button>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="bg-indigo-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-indigo-700">{savedZones.length}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wide">Saved Zones</div>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-amber-700">{favorites.length}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wide">Favorites</div>
                </div>
              </div>
            </div>
          )}

          {/* Zones Tab */}
          {tab === "zones" && (
            <div className="space-y-4">
              {/* Save current custom zones */}
              {currentCustomFeatures.length > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 space-y-2">
                  <div className="text-xs font-medium text-purple-700">
                    Save current imported zones ({currentCustomFeatures.length} features)
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newZoneName}
                      onChange={(e) => setNewZoneName(e.target.value)}
                      placeholder="Zone name..."
                      className="flex-1 px-2 py-1.5 text-xs rounded-lg border border-purple-200 focus:border-purple-300 outline-none"
                    />
                    <button
                      onClick={handleSaveCurrentZone}
                      disabled={!newZoneName.trim()}
                      className="px-3 py-1.5 text-xs font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}

              {/* Saved zones list */}
              {savedZones.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <p className="text-xs text-gray-500">No saved zones yet</p>
                  <p className="text-[10px] text-gray-400 mt-1">Import KML/GeoJSON files and save them here</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {savedZones.map((zone) => (
                    <div
                      key={zone.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: zone.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-800 truncate">{zone.name}</div>
                        <div className="text-[10px] text-gray-400">
                          {zone.features.length} features &middot; {new Date(zone.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onLoadZone(zone.features)}
                          className="p-1.5 rounded-md hover:bg-green-100 text-green-600 transition-colors"
                          title="Load zone on map"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteZone(zone.id)}
                          className="p-1.5 rounded-md hover:bg-red-100 text-red-600 transition-colors"
                          title="Delete zone"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Favorites Tab */}
          {tab === "favorites" && (
            <div className="space-y-4">
              {/* Add favorite for current map center */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-2">
                <div className="text-xs font-medium text-amber-700">Add current view as favorite</div>
                <input
                  type="text"
                  value={newFavName}
                  onChange={(e) => setNewFavName(e.target.value)}
                  placeholder="Location name..."
                  className="w-full px-2 py-1.5 text-xs rounded-lg border border-amber-200 focus:border-amber-300 outline-none"
                />
                <input
                  type="text"
                  value={newFavNote}
                  onChange={(e) => setNewFavNote(e.target.value)}
                  placeholder="Note (optional)..."
                  className="w-full px-2 py-1.5 text-xs rounded-lg border border-amber-200 focus:border-amber-300 outline-none"
                />
                <button
                  onClick={handleAddFavorite}
                  disabled={!newFavName.trim()}
                  className="w-full py-1.5 text-xs font-medium bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Favorite
                </button>
              </div>

              {/* Favorites list */}
              {favorites.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <p className="text-xs text-gray-500">No favorites yet</p>
                  <p className="text-[10px] text-gray-400 mt-1">Save your frequently visited locations</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {favorites.map((fav) => (
                    <div
                      key={fav.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-amber-50 cursor-pointer transition-colors group"
                      onClick={() => onFlyTo(fav.lat, fav.lng, fav.zoom)}
                    >
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-800 truncate">{fav.name}</div>
                        <div className="text-[10px] text-gray-400 font-mono">
                          {fav.lat.toFixed(4)}, {fav.lng.toFixed(4)}
                        </div>
                        {fav.note && (
                          <div className="text-[10px] text-gray-500 mt-0.5 truncate">{fav.note}</div>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFavorite(fav.id);
                        }}
                        className="p-1.5 rounded-md hover:bg-red-100 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                        title="Remove favorite"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
