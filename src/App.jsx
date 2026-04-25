import { useEffect, useState } from 'react';
import { NavLink, Route, Routes, useParams } from 'react-router-dom';

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
  {
    name: 'Casquette logo πτ',
    material: 'Textile',
    image: '/merch/casquette-pitau.svg',
    price: 'À définir',
    description: 'Casquette sobre avec le monogramme Patrick Pitot brodé ou imprimé.',
  },
  {
    name: 'T-shirt logo πτ',
    material: 'Textile',
    image: '/merch/tshirt-pitau.svg',
    price: 'À définir',
    description: 'T-shirt de promotion avec le logo πτ encerclé, pour accompagner la marque.',
  },
  {
    name: 'Sweat-shirt logo πτ',
    material: 'Textile',
    image: '/merch/sweatshirt-pitau.svg',
    price: 'À définir',
    description: 'Sweat-shirt premium avec le logo Patrick Pitot, pensé comme produit dérivé.',
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

const certificatePreview = {
  publicId: 'demo-pt-2026-001',
  status: 'Authentique',
  serialNumber: 'PT-2026-001',
  name: 'Couteau bois naturel veiné',
  material: 'Bois naturel',
  madeAt: 'Avril 2026',
  image: '/photos/bois-naturel/bois-naturel-veine.jpeg',
  description:
    'Pièce artisanale avec manche en bois naturel, lame signée et finition pensée pour un usage durable.',
  engraving: 'Gravure personnalisée sur lame',
  care:
    'Essuyer après usage, éviter le lave-vaisselle, nourrir le manche avec une huile adaptée si nécessaire.',
};

const navItems = [
  { to: '/', label: 'Accueil' },
  { to: '/boutique', label: 'Boutique' },
  { to: '/matieres', label: 'Matières' },
  { to: '/certificats', label: 'Certificats NFC' },
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
          <Route path="/certificats" element={<CertificatesPage />} />
          <Route path="/certificat/:publicId" element={<CertificateDetailPage />} />
          <Route path="/personnalisation" element={<PersonalizationPage />} />
          <Route path="/savoir-faire" element={<CraftPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/verify" element={<AdminVerifyPage />} />
          <Route path="/admin/demandes" element={<AdminRequestsPage />} />
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
        <NavLink to="/certificats">
          <span>NFC</span>
          <strong>Authentifier une pièce</strong>
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
        Les réalisations sont organisées comme des pièces artisanales ou petites séries. La
        boutique peut aussi accueillir des produits dérivés sobres autour du logo πτ.
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

function CertificatesPage() {
  return (
    <>
      <PageIntro eyebrow="Certificat numérique" title="Une puce NFC pour raconter et authentifier la pièce">
        Certaines créations pourront intégrer une puce NFC passive dans le manche. Au scan,
        le client arrive sur une fiche publique unique qui confirme l’authenticité du couteau
        et rassemble son histoire, ses photos officielles et ses conseils d’entretien.
      </PageIntro>

      <section className="nfc-feature">
        <div className="nfc-card">
          <span className="nfc-icon">NFC</span>
          <h2>Scan court, preuve claire.</h2>
          <p>
            La puce contient une URL publique unique du type
            <code> /certificat/:publicId</code>. Elle ne géolocalise pas le couteau :
            elle ouvre simplement le certificat quand le téléphone est approché du manche.
          </p>
          <NavLink className="button button-primary" to={`/certificat/${certificatePreview.publicId}`}>
            Voir un certificat exemple
          </NavLink>
        </div>

        <div className="nfc-steps" aria-label="Fonctionnement du certificat NFC">
          <article>
            <strong>1</strong>
            <h3>Puce intégrée</h3>
            <p>Une puce NFC passive est programmée avec l’URL publique du certificat.</p>
          </article>
          <article>
            <strong>2</strong>
            <h3>Scan client</h3>
            <p>Le téléphone ouvre la page du couteau, sans installation d’application.</p>
          </article>
          <article>
            <strong>3</strong>
            <h3>Certificat vivant</h3>
            <p>Patrick peut activer, révoquer ou enrichir les informations depuis l’admin.</p>
          </article>
        </div>
      </section>
    </>
  );
}

function CertificateDetailPage() {
  const { publicId } = useParams();

  return (
    <section className="certificate-page">
      <div className="certificate-visual">
        <img src={certificatePreview.image} alt={certificatePreview.name} />
      </div>

      <div className="certificate-panel">
        <p className="eyebrow">Certificat d’authenticité</p>
        <h1>{certificatePreview.name}</h1>
        <div className="certificate-status">
          <span>{certificatePreview.status}</span>
          <small>ID public : {publicId}</small>
        </div>

        <dl className="certificate-details">
          <div>
            <dt>Numéro de série</dt>
            <dd>{certificatePreview.serialNumber}</dd>
          </div>
          <div>
            <dt>Matière</dt>
            <dd>{certificatePreview.material}</dd>
          </div>
          <div>
            <dt>Fabrication</dt>
            <dd>{certificatePreview.madeAt}</dd>
          </div>
          <div>
            <dt>Personnalisation</dt>
            <dd>{certificatePreview.engraving}</dd>
          </div>
        </dl>

        <p>{certificatePreview.description}</p>
        <p className="care-note">{certificatePreview.care}</p>

        <div className="hero-actions">
          <NavLink className="button button-primary" to="/contact">
            Contacter l’atelier
          </NavLink>
          <NavLink className="button button-secondary" to="/boutique">
            Voir la boutique
          </NavLink>
        </div>
      </div>
    </section>
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
          Les pièces premium pourront aussi recevoir un certificat numérique NFC.
        </p>
        <div className="hero-actions">
          <NavLink className="button button-secondary" to="/contact">
            Demander une gravure
          </NavLink>
          <NavLink className="button button-secondary" to="/certificats">
            Découvrir la NFC
          </NavLink>
        </div>
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
        gestes de fabrication, pour rendre visible le travail artisanal. Les certificats NFC
        prolongent cette logique en conservant l’histoire numérique de certaines pièces.
      </p>
    </section>
  );
}

function ContactPage() {
  const [formStatus, setFormStatus] = useState({ type: 'idle', message: '' });

  async function handleCustomOrderSubmit(event) {
    event.preventDefault();
    setFormStatus({ type: 'loading', message: 'Enregistrement de votre demande...' });

    const formData = new FormData(event.currentTarget);
    const payload = {
      customerName: formData.get('customerName'),
      contact: formData.get('contact'),
      material: formData.get('material'),
      engravingText: formData.get('engravingText'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('/api/custom-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Impossible d’enregistrer la demande.');
      }

      event.currentTarget.reset();
      setFormStatus({
        type: 'success',
        message: 'Votre demande est enregistrée. Patrick pourra la traiter depuis l’administration.',
      });
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: error.message || 'Une erreur est survenue pendant l’enregistrement.',
      });
    }
  }

  return (
    <section className="contact contact-form-page">
      <div>
        <p className="eyebrow">Commande personnalisée</p>
        <h1>Préparer une demande de couteau sur mesure</h1>
      </div>

      <form
        className="request-form"
        aria-label="Pré-demande de commande personnalisée"
        onSubmit={handleCustomOrderSubmit}
      >
        <label>
          Nom
          <input name="customerName" placeholder="Votre nom" required type="text" />
        </label>
        <label>
          Téléphone ou email
          <input name="contact" placeholder="Pour vous recontacter" required type="text" />
        </label>
        <label>
          Matière souhaitée
          <select name="material" defaultValue="" required>
            <option value="" disabled>
              Choisir une matière
            </option>
            <option>Bois naturel</option>
            <option>Bois stabilisé</option>
            <option>Micarta</option>
          </select>
        </label>
        <label>
          Gravure souhaitée
          <input
            name="engravingText"
            placeholder="Initiales, prénom, date, message court..."
            type="text"
          />
        </label>
        <label>
          Message
          <textarea
            name="message"
            placeholder="Usage, gravure, budget, délai souhaité..."
            required
            rows="5"
          />
        </label>
        <button
          className="button button-primary"
          disabled={formStatus.type === 'loading'}
          type="submit"
        >
          {formStatus.type === 'loading' ? 'Enregistrement...' : 'Enregistrer la demande'}
        </button>
        {formStatus.message ? (
          <p className={`form-status ${formStatus.type}`}>{formStatus.message}</p>
        ) : null}
      </form>
    </section>
  );
}

function AdminLoginPage() {
  const [status, setStatus] = useState({ type: 'idle', message: '', devMagicLink: '' });

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    setStatus({ type: 'loading', message: 'Préparation du lien magique...', devMagicLink: '' });

    try {
      const response = await fetch('/api/admin/magic-link/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Impossible de générer le lien magique.');
      }

      setStatus({
        type: 'success',
        message: data.message,
        devMagicLink: data.devMagicLink || '',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Une erreur est survenue.',
        devMagicLink: '',
      });
    }
  }

  return (
    <section className="admin-page">
      <div className="admin-card">
        <p className="eyebrow">Administration</p>
        <h1>Recevoir un lien magique</h1>
        <p>
          L’accès est réservé aux emails autorisés. Si l’adresse est connue, un lien de
          connexion temporaire est envoyé pour consulter les demandes client.
        </p>
        <form className="request-form" onSubmit={handleSubmit}>
          <label>
            Email administrateur
            <input
              name="email"
              placeholder="compta@laboratoire-pitot.com"
              required
              type="email"
            />
          </label>
          <button className="button button-primary" disabled={status.type === 'loading'} type="submit">
            {status.type === 'loading' ? 'Envoi...' : 'Recevoir le lien magique'}
          </button>
          {status.message ? <p className={`form-status ${status.type}`}>{status.message}</p> : null}
          {status.devMagicLink ? (
            <NavLink className="admin-dev-link" to={new URL(status.devMagicLink).pathname + new URL(status.devMagicLink).search}>
              Ouvrir le lien magique local
            </NavLink>
          ) : null}
        </form>
      </div>
    </section>
  );
}

function AdminVerifyPage() {
  const [status, setStatus] = useState({ type: 'loading', message: 'Vérification du lien...' });

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');

    async function verifyToken() {
      if (!token) {
        setStatus({ type: 'error', message: 'Token manquant.' });
        return;
      }

      try {
        const response = await fetch(`/api/admin/magic-link/verify?token=${encodeURIComponent(token)}`, {
          credentials: 'include',
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.error || 'Lien magique invalide.');
        }

        setStatus({ type: 'success', message: 'Connexion réussie. Redirection...' });
        window.setTimeout(() => {
          window.location.href = '/admin/demandes';
        }, 700);
      } catch (error) {
        setStatus({ type: 'error', message: error.message || 'Impossible de vérifier le lien.' });
      }
    }

    verifyToken();
  }, []);

  return (
    <section className="admin-page">
      <div className="admin-card">
        <p className="eyebrow">Administration</p>
        <h1>Connexion</h1>
        <p className={`form-status ${status.type}`}>{status.message}</p>
        {status.type === 'error' ? (
          <NavLink className="button button-secondary" to="/admin">
            Demander un nouveau lien
          </NavLink>
        ) : null}
      </div>
    </section>
  );
}

function AdminRequestsPage() {
  const [state, setState] = useState({
    type: 'loading',
    message: 'Chargement des demandes...',
    contacts: [],
    customOrders: [],
  });

  useEffect(() => {
    async function loadRequests() {
      try {
        const response = await fetch('/api/admin/requests', { credentials: 'include' });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.error || 'Accès admin requis.');
        }

        setState({
          type: 'success',
          message: '',
          contacts: data.contacts || [],
          customOrders: data.customOrders || [],
        });
      } catch (error) {
        setState({
          type: 'error',
          message: error.message || 'Impossible de charger les demandes.',
          contacts: [],
          customOrders: [],
        });
      }
    }

    loadRequests();
  }, []);

  return (
    <section className="admin-requests">
      <div className="section-heading">
        <p className="eyebrow">Administration</p>
        <h1>Demandes client</h1>
        <p>Les messages et demandes personnalisées sont lus depuis PostgreSQL.</p>
      </div>

      {state.type === 'loading' || state.type === 'error' ? (
        <div className="admin-card">
          <p className={`form-status ${state.type}`}>{state.message}</p>
          {state.type === 'error' ? (
            <NavLink className="button button-secondary" to="/admin">
              Recevoir un lien magique
            </NavLink>
          ) : null}
        </div>
      ) : (
        <div className="admin-grid">
          <AdminRequestColumn title="Commandes personnalisées" rows={state.customOrders} type="custom" />
          <AdminRequestColumn title="Messages de contact" rows={state.contacts} type="contact" />
        </div>
      )}
    </section>
  );
}

function AdminRequestColumn({ title, rows, type }) {
  return (
    <div className="admin-column">
      <h2>{title}</h2>
      {rows.length === 0 ? <p className="empty-state">Aucune demande pour le moment.</p> : null}
      {rows.map((row) => (
        <article className="admin-request-card" key={`${type}-${row.id}`}>
          <div className="admin-request-heading">
            <h3>{row.customer_name}</h3>
            <span>{row.status}</span>
          </div>
          {type === 'custom' ? (
            <p className="product-category">{row.material_name || 'Matière à préciser'}</p>
          ) : (
            <p className="product-category">{row.subject || 'Message'}</p>
          )}
          <p>{row.message}</p>
          {row.engraving_text ? <p>Gravure : {row.engraving_text}</p> : null}
          <div className="admin-contact-lines">
            {row.customer_email ? <a href={`mailto:${row.customer_email}`}>{row.customer_email}</a> : null}
            {row.customer_phone ? <a href={`tel:${row.customer_phone}`}>{row.customer_phone}</a> : null}
            <small>{new Date(row.created_at).toLocaleString('fr-FR')}</small>
          </div>
        </article>
      ))}
    </div>
  );
}

function App() {
  return <Layout />;
}

export default App;
