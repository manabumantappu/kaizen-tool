<<<<<<< HEAD
function uuid() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function num(v) {
  return Number(v) || 0;
}

export function migrateKaizenDataIfNeeded() {
  const raw = JSON.parse(localStorage.getItem("kaizenData"));
  if (!Array.isArray(raw) || raw.length === 0) return;

  // 🚫 sudah versi baru
  if (raw[0]?.meta?.version === 2) return;

  console.info("🔄 Migrating Kaizen data to v2...");

  const migrated = raw.map(old => ({
    id: old.id || uuid(),

    date: old.date || new Date().toISOString(),
    section: old.section || "-",
    title: old.title || "(untitled)",

    time: {
      before: num(old.timeBefore),
      after: num(old.timeAfter),
      saved:
        num(old.timeSaved) ||
        Math.max(0, num(old.timeBefore) - num(old.timeAfter))
    },

    cost: {
      before: num(old.costBefore),
      after: num(old.costAfter),
      saved:
        num(old.costSaved) ||
        Math.max(0, num(old.costBefore) - num(old.costAfter)),
      yearly:
        (num(old.costSaved) ||
          Math.max(0, num(old.costBefore) - num(old.costAfter))) * 12
    },

    caption: {
      before: old.captionBefore || "-",
      after: old.captionAfter || "-"
    },

    images: {
      before: old.beforeImg || "",
      after: old.afterImg || ""
    },

    meta: {
      version: 2,
      migratedAt: new Date().toISOString()
    }
  }));

  // 🛟 backup
  localStorage.setItem(
    "kaizenData_backup_v1",
    JSON.stringify(raw)
  );

  localStorage.setItem(
    "kaizenData",
    JSON.stringify(migrated)
  );

  console.info("✅ Migration completed:", migrated.length, "items");
}
=======
function uuid() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function num(v) {
  return Number(v) || 0;
}

export function migrateKaizenDataIfNeeded() {
  const raw = JSON.parse(localStorage.getItem("kaizenData"));
  if (!Array.isArray(raw) || raw.length === 0) return;

  // 🚫 sudah versi baru
  if (raw[0]?.meta?.version === 2) return;

  console.info("🔄 Migrating Kaizen data to v2...");

  const migrated = raw.map(old => ({
    id: old.id || uuid(),

    date: old.date || new Date().toISOString(),
    section: old.section || "-",
    title: old.title || "(untitled)",

    time: {
      before: num(old.timeBefore),
      after: num(old.timeAfter),
      saved:
        num(old.timeSaved) ||
        Math.max(0, num(old.timeBefore) - num(old.timeAfter))
    },

    cost: {
      before: num(old.costBefore),
      after: num(old.costAfter),
      saved:
        num(old.costSaved) ||
        Math.max(0, num(old.costBefore) - num(old.costAfter)),
      yearly:
        (num(old.costSaved) ||
          Math.max(0, num(old.costBefore) - num(old.costAfter))) * 12
    },

    caption: {
      before: old.captionBefore || "-",
      after: old.captionAfter || "-"
    },

    images: {
      before: old.beforeImg || "",
      after: old.afterImg || ""
    },

    meta: {
      version: 2,
      migratedAt: new Date().toISOString()
    }
  }));

  // 🛟 backup
  localStorage.setItem(
    "kaizenData_backup_v1",
    JSON.stringify(raw)
  );

  localStorage.setItem(
    "kaizenData",
    JSON.stringify(migrated)
  );

  console.info("✅ Migration completed:", migrated.length, "items");
}

>>>>>>> 6d1a56fdff9fb21b535ce3daf202dc325d629f3b
