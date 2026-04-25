import { NavLink, Route, Routes } from 'react-router-dom';

const products = [
  {
    name: 'Couteau bois naturel clair',
    material: 'Bois naturel',
    image: '/photos/bois-naturel/bois-naturel-clair.jpeg',
    price: 'Sur demande',
    description: 'Un manche lumineux et sobre, idéal pour une présentation cuisine élégante.',
  },
  {
    name: 'Couteau bois naturel foncé',
    material: 'Bois naturel',
    image: '/photos/bois-naturel/bois-naturel-fonce.jpeg',
    price: 'Sur demande',
    description: 'Une finition plus contrastée, avec un caractère visuel marqué.',
  },
  {
    name: 'Couteau micarta jeans',
    material: 'Micarta',
    image: '/photos/micarta/micarta-jeans.jpeg',
    price: 'Sur demande',
    description: 'Un manche bleu texturé, moderne et robuste, photographié sur écorce.',
  },
  {
    name: 'Couteau micarta vert',
    material: 'Micarta',
    image: '/photos/micarta/micarta-vert.jpeg',
    price: 'Sur demande',
    description: 'Une pièce au manche vert profond, pensée pour une identité plus contemporaine.',
  },
  {
    name: 'Couteau bois naturel rouge',
    material: 'Bois naturel',
    image: '/photos/bois-naturel/bois-naturel-rouge.jpeg',
    price: 'Sur demande',
    description: 'Un manche rouge chaleureux qui met en avant le travail de finition.',
  },
  {
    name: 'Peuplier stabilisé',
    material: 'Bois stabilisé',
    image: '/photos/bois-stabilise/loupe-de-peuplier.jpeg',
    price: 'Sur demande',
    description: 'Une option matière à valoriser pour les commandes personnalisées.',
  },
];

const materials = [
  {
    name: 'Bois naturel',
    text: 'Chaleur, veinage et pièces singulières pour des couteaux au rendu authentique.',
    image: '/photos/bois-naturel/bois-naturel-veine.jpeg',
  },
  {
    name: 'Bois stabilisé',
    text: 'Une matière travaillée pour gagner en tenue, en profondeur et en durabilité.',
    image: '/photos/bois-stabilise/loupe-de-peuplier.jpeg',
  },
  {
    name: 'Micarta',
    text: 'Un rendu plus technique, coloré et résistant, adapté aux usages réguliers.',
    image: '/photos/micarta/micarta-rouge.jpeg',
  },
];

const highlights = ['Bois naturel', 'Bois stabilisé', 'Micarta'];

const navItems = [
  { to: '/', label: 'Accueil' },
  { to: '/boutique', label: 'Boutique' },
  { to: '/matieres', label: 'Matières' },
  { to: '/personnalisation', label: 'Personnalisation' },
  { to: '/savoir-faire', label: 'Savoir-faire' },
  { to: '/contact', label: 'Contact' },
];

function Logo() {
  return (
    <span className="logo-lockup" aria-hidden="true">
      <svg className="logo-mark" viewBox="0 0 64 64" role="img">
        <circle cx="32" cy="32" r="28" />
        <text x="32" y="41">πτ</text>
      </svg>
      <span className="logo-text">
        <strong>Patrick Pitot</strong>
        <small>Coutellerie artisanale</small>
      </span>
    </span>
  );
}

function Layout() {
  return (
    <>
      <header className="site-header">
        <NavLink className="brand" to="/" aria-label="Accueil Patrick Pitot">
          <Logo />
        </NavLink>
        <nav className="nav" aria-label="Navigation principale">
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/boutique" element={<ShopPage />} />
          <Route path="/matieres" element={<MaterialsPage />} />
          <Route path="/personnalisation" element={<PersonalizationPage />} />
          <Route path="/savoir-faire" element={<CraftPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>
    </>
  );
}

function PageIntro({ eyebrow, title, children }) {
  return (
    <section className="page-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{children}</p>
    </section>
  );
}

function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">Coutellerie artisanale</p>
          <h1>Des couteaux fabriqués à la main, pensés comme des pièces de caractère.</h1>
          <p className="hero-text">
            Patrick Pitot imagine, façonne et assemble des couteaux artisanaux où chaque
            détail compte : ligne, matière, équilibre et usage.
          </p>
          <div className="hero-actions">
            <NavLink className="button button-primary" to="/boutique">
              Découvrir la boutique
            </NavLink>
            <NavLink className="button button-secondary" to="/personnalisation">
              Voir la personnalisation
            </NavLink>
          </div>
        </div>

        <aside className="hero-card" aria-label="Mise en avant artisanale">
          <img
            src="/photos/bois-naturel/bois-naturel-veine.jpeg"
            alt="Couteau artisanal avec manche en bois naturel"
          />
          <p>Acier, bois, patience et précision.</p>
        </aside>
      </section>

      <section className="highlights" aria-label="Points forts">
        {highlights.map((item) => (
          <article key={item}>
            <span />
            <p>{item}</p>
          </article>
        ))}
      </section>

      <section className="quick-links" aria-label="Rubriques principales">
        <NavLink to="/boutique">
          <span>Boutique</span>
          <strong>Voir les premières pièces</strong>
        </NavLink>
        <NavLink to="/matieres">
          <span>Matières</span>
          <strong>Comparer bois et micarta</strong>
        </NavLink>
        <NavLink to="/contact">
          <span>Sur mesure</span>
          <strong>Préparer une commande</strong>
        </NavLink>
      </section>
    </>
  );
}

function ShopPage() {
  return (
    <>
      <PageIntro eyebrow="Boutique" title="Premières pièces à présenter">
        Les réalisations sont organisées comme des pièces artisanales ou petites séries, avec
        une entrée claire par matière de manche.
      </PageIntro>

      <div className="product-grid">
        {products.map((product) => (
          <article className="product-card" key={product.name}>
            <div className="product-image">
              <img src={product.image} alt={product.name} />
              <span>{product.material}</span>
            </div>
            <div className="product-body">
              <p className="product-category">{product.material}</p>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <strong>{product.price}</strong>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function MaterialsPage() {
  return (
    <>
      <PageIntro eyebrow="Matières" title="Choisir le caractère du manche">
        Bois naturel, bois stabilisé ou micarta : la matière change l’allure, la sensation en
        main et la personnalité du couteau.
      </PageIntro>

      <div className="material-grid">
        {materials.map((material) => (
          <article className="material-card" key={material.name}>
            <img src={material.image} alt={`Exemple de couteau en ${material.name}`} />
            <div>
              <h2>{material.name}</h2>
              <p>{material.text}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function PersonalizationPage() {
  return (
    <section className="engraving">
      <div className="engraving-media">
        <img
          src="/photos/bois-naturel/bois-naturel-veine.jpeg"
          alt="Zoom sur une gravure personnalisée réalisée sur la lame"
        />
      </div>
      <div className="engraving-content">
        <p className="eyebrow">Personnalisation</p>
        <h1>Une gravure discrète pour signer une pièce unique.</h1>
        <p>
          La lame peut recevoir une inscription personnalisée : initiales, date, prénom,
          message court ou marque de série. Cette option transforme le couteau en objet plus
          personnel, pensé pour un cadeau, une commande spéciale ou une pièce de collection.
        </p>
        <NavLink className="button button-secondary" to="/contact">
          Demander une gravure
        </NavLink>
      </div>
    </section>
  );
}

function CraftPage() {
  return (
    <section className="craft">
      <div>
        <p className="eyebrow">Savoir-faire</p>
        <h1>Un objet utile, durable et personnel.</h1>
      </div>
      <p>
        Chaque couteau peut raconter une intention : un usage précis, une essence de bois,
        une forme de manche, une finition. Le site doit montrer autant le résultat que les
        gestes de fabrication, pour rendre visible le travail artisanal.
      </p>
    </section>
  );
}

function ContactPage() {
  return (
    <section className="contact contact-form-page">
      <div>
        <p className="eyebrow">Commande personnalisée</p>
        <h1>Préparer une demande de couteau sur mesure</h1>
        <p>
          Les contacts et commandes seront enregistrés en base dans les tables
          <code> contact_request</code>, <code> custom_order_request</code> et
          <code> order_request</code>. L’email n’est plus le canal principal.
        </p>
      </div>

      <form className="request-form" aria-label="Pré-demande de commande personnalisée">
        <label>
          Nom
          <input name="customerName" placeholder="Votre nom" type="text" />
        </label>
        <label>
          Téléphone ou email
          <input name="contact" placeholder="Pour vous recontacter" type="text" />
        </label>
        <label>
          Matière souhaitée
          <select name="material" defaultValue="">
            <option value="" disabled>
              Choisir une matière
            </option>
            <option>Bois naturel</option>
            <option>Bois stabilisé</option>
            <option>Micarta</option>
          </select>
        </label>
        <label>
          Message
          <textarea
            name="message"
            placeholder="Usage, gravure, budget, délai souhaité..."
            rows="5"
          />
        </label>
        <button className="button button-primary" disabled type="button">
          Connexion base à venir
        </button>
      </form>
    </section>
  );
}

function App() {
  return <Layout />;
}

export default App;
