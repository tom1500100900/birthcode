export const PL_BIRTHCODE_SECTION_ORDER = [
  'birthcode',
  'potential',
  'mind',
  'emotions',
  'action',
  'decisions',
  'genius',
  'stress',
  'relations',
] as const;

export const PL_BIRTHCODE_SECTION_TITLES = {
  birthcode: 'Twój Birthcode',
  potential: 'Twój główny potencjał',
  mind: 'Jak działa Twój umysł',
  emotions: 'Twój system emocjonalny',
  action: 'Twój styl działania',
  decisions: 'Jak podejmujesz decyzje',
  genius: 'Twój tryb geniuszu',
  stress: 'Twój wzorzec stresu',
  relations: 'Relacje i wpływ społeczny',
} as const;

export const PL_BIRTHCODE_SECTION_TEMPLATES = {
  birthcode: [
    'Twój Birthcode opiera się na archetypie {{archetype}}. To nie jest etykieta osobowości — to opis systemu operacyjnego, którego Twoja psychika używa do nawigacji w rzeczywistości.',
    'Główne napięcie napędzające Twój system to {{tension_1}}. Oznacza to, że Twoja najwyższa jakość wyników pojawia się na przecięciu tych dwóch sił — nie przez rozwiązanie napięcia, ale przez nauczenie się świadomej pracy z nim.',
    'Twoje Słońce w {{sun_label}} ({{sun_segment_tone}}), Księżyc w {{moon_label}} ({{moon_segment_tone}}) i Ascendent w {{asc_label}} ({{asc_segment_tone}}) to stylistyczne kanały, przez które ten podstawowy wzorzec się wyraża.',
    'Dominujące metryki kształtujące Twój wzorzec to {{top_metric_1}}, {{top_metric_2}} i {{top_metric_3}}. To psychologiczne dźwignie, które po aktywacji produkują Twój najbardziej charakterystyczny wynik.',
  ],
  potential: [
    'Twój największy potencjał aktywuje się, gdy Twoje myślenie, regulacja emocjonalna i styl działania wyrównują się w tym samym kierunku. W tych momentach działasz z niezwykłą jasnością i produujesz wyniki, które jednocześnie integrują logikę i intuicję.',
    'Jako {{archetype}}, Twój główny wkład to nie wysiłek — to specyficzna jakość wglądu i wykonania, która wynika z Twojej unikalnej kombinacji {{top_metric_1}} i {{top_metric_2}}.',
    'Napięcie między {{tension_1}} to nie słabość do pokonania — to silnik Twojej najbardziej oryginalnej pracy. Ludzie, którzy najbardziej korzystają z Ciebie, to ci, którzy potrzebują kogoś, kto potrafi utrzymać obie strony tego równania.',
    'Twój potencjał jest najbardziej widoczny, gdy działasz w środowiskach, które pozwalają Twoim dominującym metrykom funkcjonować z pełną mocą, bez zmuszania Cię do tłumienia drugorzędnych napięć, które nadają Twojej pracy głębię.',
  ],
  mind: [
    'Twój umysł działa przez pryzmat {{top_metric_1}} i {{top_metric_2}}. Oznacza to, że naturalnie przetwarzasz informacje, filtrując je przez te dwa wymiary przed wyciągnięciem wniosków.',
    'Myślisz najlepiej, gdy masz dostęp zarówno do struktury, jak i otwartej przestrzeni — napięcie {{tension_1}} oznacza, że Twoja wydajność poznawcza osiąga szczyt, gdy możesz naprzemiennie przechodzić między skupioną analizą a myśleniem eksploracyjnym.',
    'Twoje Słońce w {{sun_label}} kształtuje, jak Twoja intencja staje się działaniem: {{sun_segment_tone}} Twój Księżyc w {{moon_label}} kształtuje, jak regulujesz stan wewnętrzny, który umożliwia myślenie: {{moon_segment_tone}}',
    'Praktyczna implikacja jest taka, że Twoje najlepsze myślenie nie dzieje się pod stałą presją ani w całkowitej izolacji. Dzieje się w środowiskach, które pasują do Twojego naturalnego rytmu poznawczego.',
  ],
  emotions: [
    'Twój system emocjonalny jest głównie kształtowany przez {{top_metric_1}} i napięcie {{tension_1}}. Emocje nie są szumem w Twoim systemie — są danymi. Gdy nauczysz się je dokładnie odczytywać, stają się Twoim najbardziej niezawodnym sygnałem decyzyjnym.',
    'Twój Księżyc w {{moon_label}} definiuje, jak przywracasz równowagę emocjonalną: {{moon_segment_tone}} To nie jest preferencja — to biologiczny wymóg. Gdy ten kanał jest zablokowany, Twoja ogólna wydajność się degraduje.',
    'Napięcie {{tension_2}} tworzy specyficzny wzorzec emocjonalny: możesz oscylować między stanami, które wydają się sprzeczne. To nie jest niestabilność — to naturalny rytm systemu, który jednocześnie trzyma dwa silne napędy.',
    'Regulacja emocjonalna dla Ciebie to nie odczuwanie mniej. To nazywanie tego, co jest aktywne, rozumienie, które napięcie napędza stan, i wybór odpowiedzi, która honoruje obie strony, zamiast tłumić jedną.',
  ],
  action: [
    'Twój styl działania jest definiowany przez {{top_metric_1}} i {{top_metric_2}}. Poruszasz się najskuteczniej, gdy te dwie siły są wyrównane — gdy cel jest jasny, ograniczenia są zdefiniowane, a ścieżka wykonania pasuje do Twojego naturalnego rytmu.',
    'Twój Ascendent w {{asc_label}} kształtuje, jak wchodzisz w sytuacje i inicjujesz działanie: {{asc_segment_tone}} To Twoja domyślna strategia pierwszego kontaktu — sposób, w jaki naturalnie zaczynasz rzeczy przed świadomą korektą.',
    'Napięcie {{tension_1}} oznacza, że Twój styl działania ma dwa tryby: jeden priorytetyzujący szybkość i jeden priorytetyzujący precyzję. Twój najwyższy wynik pojawia się, gdy świadomie wybierasz, którego trybu wymaga sytuacja, zamiast domyślnie przechodzić na swoją dominującą stronę.',
    'Praktycznie oznacza to, że działasz najlepiej, gdy masz jasność co do typu wymaganego działania, zanim zaczniesz. Niejednoznaczne mandaty tworzą wewnętrzne tarcie, które spowalnia Twoje wykonanie.',
  ],
  decisions: [
    'Jakość Twoich decyzji jest kształtowana przez wzajemne oddziaływanie {{metric_analytical_order}} i {{metric_risk_orientation}}. Te dwie metryki definiują Twoją domyślną architekturę decyzyjną — ile analizujesz przed zobowiązaniem i ile niepewności możesz tolerować.',
    'Napięcie {{tension_1}} bezpośrednio wpływa na Twoją szybkość decyzyjną. Gdy to napięcie jest nierozwiązane, możesz oscylować między nadmierną analizą a przedwczesnym zobowiązaniem. Rozwiązaniem jest zdefiniowanie terminu decyzji przed treścią decyzji.',
    'Twój Ascendent w {{asc_label}} moduluje, jak prezentujesz decyzje innym: {{asc_segment_tone}} To wpływa nie tylko na to, co decydujesz, ale jak Twoje decyzje lądują w kontekstach relacyjnych i organizacyjnych.',
    'Praktyczny protokół: dla decyzji o wysokiej stawce użyj swojej siły analitycznej do mapowania opcji; dla decyzji czasowo wrażliwych użyj swojej orientacji na ryzyko, aby zobowiązać się przed przybyciem doskonałej informacji. Wiedza, z jakim typem decyzji masz do czynienia, jest sama w sobie pierwszą decyzją.',
  ],
  genius: [
    'Twoja strefa geniuszu aktywuje się, gdy {{top_metric_1}}, {{top_metric_2}} i {{top_metric_3}} działają jednocześnie z pełną mocą. To stan, w którym Twój wynik staje się jakościowo inny — nie tylko więcej, ale lepszy w rodzaju.',
    'Jako {{archetype}}, Twój specyficzny geniusz to zdolność do działania na przecięciu Twojego głównego napięcia: {{tension_1}}. Większość ludzi wybiera jedną stronę. Ty generujesz wartość, trzymając obie i znajdując syntezę, której żadna strona sama nie może wyprodukować.',
    'Warunki dla geniuszu są specyficzne: potrzebujesz środowiska, które aktywuje Twoje dominujące metryki, wyzwania, które wymaga podstawowej zdolności Twojego archetypu, i wystarczającego bezpieczeństwa psychologicznego, aby działać bez tłumienia Twoich drugorzędnych napięć.',
    'Geniusz dla Ciebie to nie stały stan — to tryb, w który wchodzisz, gdy warunki się wyrównują. Praktyczna praca to identyfikowanie tych warunków i celowe ich inżynierowanie, zamiast czekania, aż wystąpią przez przypadek.',
  ],
  stress: [
    'Pod stresem Twój system domyślnie nadmiernie polega na Twojej dominującej metryce, jednocześnie tłumiąc słabsze wymiary: {{low_metric_1}} i {{low_metric_2}}. To tworzy przewidywalny wzorzec degradacji, który możesz nauczyć się przerywać.',
    'Napięcie {{tension_1}} staje się najbardziej ostre pod presją. Gdy jesteś zestresowany, prawdopodobnie zapadniesz się w stronę jednej strony tego napięcia — albo nadmiernie kontrolując, albo nadmiernie uwalniając — zamiast utrzymywać produktywną równowagę, która definiuje Twoją najlepszą pracę.',
    'Twoja sygnatura stresowa jako {{archetype}} jest specyficzna: możesz wyglądać funkcjonalnie na powierzchni, jednocześnie wewnętrznie działając na wyczerpanych zasobach. Wczesne znaki ostrzegawcze to zazwyczaj zwężenie perspektywy i wzrost reaktywnego podejmowania decyzji.',
    'Regeneracja dla Ciebie to nie pasywny odpoczynek — to aktywna rekalibracja. Najszybsza ścieżka powrotu do linii bazowej to nazwanie aktywnego napięcia, zidentyfikowanie, w którą stronę się zapadłeś, i podjęcie jednego celowego działania, które reaktywuje stłumiony wymiar.',
  ],
  relations: [
    'W relacjach Twój wzorzec psychologiczny tworzy specyficzną dynamikę: Twoje dominujące metryki — {{top_metric_1}} i {{top_metric_2}} — są zarówno atutem, jak i źródłem tarcia, w zależności od tego, czy system drugiej osoby jest kompatybilny czy komplementarny.',
    'Twoja największa siła relacyjna to jakość, która wynika z Twojego archetypu: {{archetype}}. Ludzie, którzy najbardziej korzystają z Twojej obecności, to ci, którzy potrzebują kogoś, kto potrafi utrzymać Twoją specyficzną kombinację głębi i zdolności.',
    'Napięcie {{tension_1}} tworzy przewidywalny wzorzec relacyjny: możesz przyciągać ludzi, którzy reprezentują jedną stronę Twojego napięcia, tworząc dynamikę, w której sama relacja staje się areną do wypracowania wewnętrznego konfliktu.',
    'Praktyczna implikacja: Twoje najlepsze relacje nie są z ludźmi, którzy rozwiązują Twoje napięcie za Ciebie, ale z ludźmi, którzy szanują obie jego strony. Relacje, które zmuszają Cię do tłumienia jednego wymiaru Twojego podstawowego wzorca, będą tworzyć chroniczne tarcie.',
  ],
} as const;
