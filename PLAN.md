# 🧠 Birthcode — Dokumentacja Projektu i Plan Rozwoju

## 1. 🎯 Wizja produktu

**Birthcode = aplikacja psycho-astrologiczna nowej generacji**

- Astrologia = wejście (sygnały)
- Psychologia = interpretacja
- UX = działanie (praktyki + decyzje)

👉 Nie horoskop  
👉 Nie terapia  
👉 System interpretacji zachowania  

---

## 2. 🧩 Architektura systemu

### 2.1 Warstwy

#### 1️⃣ Engine (NIE ruszamy)
- Swiss Ephemeris
- planety, domy, ASC/MC, degree

#### 2️⃣ Signals layer

```ts
{
  sunSign,
  moonSign,
  ascSign,
  degree,
  archetype,
  dominantEnergy,
  tensions[],
  metrics: {
    structure,
    curiosity,
    stability,
    social
  }
}
```

#### 3️⃣ Content engine (problem)
Obecnie:
```
Sun + Moon + Asc
```

Docelowo:
```
signals → wybór bloków → raport
```

---

## 3. 🔥 Problem

Content jest generyczny, bo:
- ignoruje tensions i metrics
- opiera się na znakach
- składa się liniowo

Efekt:
👉 brzmi jak horoskop

---

## 4. ✅ Docelowy model

### Content oparty o sygnały:

Priorytet:

1. Tensions  
2. Archetype  
3. Metrics  
4. Dominant energy  
5. Znaki (tylko jako uzasadnienie)

---

## 5. 🧱 Premium content

### Struktura bloku:

```ts
{
  id,
  when,
  text,
  type
}
```

### Każdy blok musi mieć:

1. Tezę  
2. Mechanizm  
3. Konsekwencję  

---

## 6. ⚙️ Generator

```ts
if (tension) use tension narrative
else if (dominant) use energy narrative
else use archetype
```

---

## 7. 🧪 Debug

Debug pokazuje:
- big three
- tensions
- metrics
- blockIds

👉 klucz do jakości

---

## 8. 🧩 Praktyki

Kategorie:
- Tożsamość
- Kariera
- Relacje
- Stres

Struktura:
```
Insight + lista praktyk
```

---

## 9. ❤️ Match

Score: 0–100

Opis:
- czy działa
- dlaczego
- co robić

---

## 10. 🚀 Plan rozwoju

### Etap 1
Diagnostyka sygnałów

### Etap 2
Podłączenie generatora do signals

### Etap 3
Gold set (10–20 raportów)

### Etap 4
Biblioteka bloków

### Etap 5
Praktyki UX

### Etap 6
Match premium

### Etap 7
LLM jako stylista (opcjonalnie)

---

## 11. 🧠 Zasady

- Nie pisz dla znaków
- Tensions = klucz
- Metrics = personalizacja
- Debug = kontrola jakości
- 100 dobrych bloków > 1000 słabych

---

## 12. 🔥 Core insight

**Birthcode to interpretacja napięć, nie znaków.**
