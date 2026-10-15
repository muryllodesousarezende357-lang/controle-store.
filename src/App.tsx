import { useMemo, useState } from "react";
import {
  Activity, ArrowDownRight, ArrowUpRight, BarChart3, Bell, Boxes, CalendarDays,
  Check, ChevronDown, CircleDollarSign, ClipboardList, CreditCard, Download,
  LayoutDashboard, LogOut, Menu, Package, Plus, Search, Settings, ShoppingBag,
  ShoppingCart, SlidersHorizontal, Users, Wallet, X
} from "lucide-react";
import { money } from "./lib/records";

type Item = { id: number; name: string; category: string; stock: number; price: number };
type Client = { id: number; name: string; phone: string; balance: number };
type Sale = { id: string; client: string; date: string; total: number; status: "Pago" | "Pendente" };

const initialProducts: Item[] = [
  { id: 1, name: "Camiseta básica premium", category: "Vestuário", stock: 42, price: 79.9 },
  { id: 2, name: "Calça jeans slim", category: "Vestuário", stock: 18, price: 159.9 },
  { id: 3, name: "Tênis casual urbano", category: "Calçados", stock: 7, price: 229.9 },
  { id: 4, name: "Bolsa transversal", category: "Acessórios", stock: 0, price: 119.9 },
];
const initialClients: Client[] = [
  { id: 1, name: "Ana Souza", phone: "(61) 99912-3456", balance: 120 },
  { id: 2, name: "Carlos Lima", phone: "(61) 99876-5432", balance: 0 },
  { id: 3, name: "Mariana Alves", phone: "(61) 99111-2233", balance: 85.5 },
];
const initialSales: Sale[] = [
  { id: "#V-1048", client: "Ana Souza", date: "Hoje, 14:32", total: 319.8, status: "Pago" },
  { id: "#V-1047", client: "Carlos Lima", date: "Hoje, 13:10", total: 159.9, status: "Pago" },
  { id: "#V-1046", client: "Mariana Alves", date: "Hoje, 11:45", total: 229.9, status: "Pendente" },
  { id: "#V-1045", client: "João Pereira", date: "Ontem, 17:21", total: 79.9, status: "Pago" },
];

const nav = [
  { label: "Visão geral", icon: LayoutDashboard, group: "Principal" },
  { label: "Produtos", icon: Package, group: "Principal" },
  { label: "Clientes", icon: Users, group: "Principal" },
  { label: "Vendas", icon: ShoppingCart, group: "Operação" },
  { label: "Fiados", icon: ClipboardList, group: "Operação" },
  { label: "Caixa", icon: Wallet, group: "Operação" },
  { label: "Orçamentos", icon: ClipboardList, group: "Operação" },
  { label: "Relatórios", icon: BarChart3, group: "Gestão" },
  { label: "Equipe", icon: Users, group: "Gestão" },
  { label: "Configurações", icon: Settings, group: "Gestão" },
];

function App() {
  const [page, setPage] = useState("Visão geral");
  const [products, setProducts] = useState(initialProducts);
  const [clients] = useState(initialClients);
  const [sales] = useState(initialSales);
  const [query, setQuery] = useState("");
  const [showProductForm, setShowProductForm] = useState(false);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("0");
  const [productStock, setProductStock] = useState("0");
  const [mobileNav, setMobileNav] = useState(false);

  const filteredProducts = useMemo(() => products.filter(p =>
    (p.name + " " + p.category).toLowerCase().includes(query.toLowerCase())
  ), [products, query]);
  const filteredClients = useMemo(() => clients.filter(c =>
    (c.name + " " + c.phone).toLowerCase().includes(query.toLowerCase())
  ), [clients, query]);
  const filteredSales = useMemo(() => sales.filter(s =>
    (s.id + " " + s.client + " " + s.status).toLowerCase().includes(query.toLowerCase())
  ), [sales, query]);

  const addProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!productName.trim()) return;
    setProducts(prev => [...prev, {
      id: Date.now(), name: productName.trim(), category: "Geral",
      stock: Math.max(0, Number(productStock) || 0), price: Math.max(0, Number(productPrice) || 0)
    }]);
    setProductName("");
    setProductPrice("0");
    setProductStock("0");
    setShowProductForm(false);
  };

  const exportProducts = () => {
    const rows = [["ID", "Produto", "Categoria", "Estoque", "Preço"], ...products.map(p =>
      [String(p.id), p.name, p.category, String(p.stock), p.price.toFixed(2)]
    )];
    const csv = rows.map(row => row.map(v => '"' + v.replaceAll('"', '""') + '"').join(";")).join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "produtos-controle-store.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const title = page === "Visão geral" ? "Visão geral" : page;
  const subtitle = page === "Visão geral"
    ? "Acompanhe o desempenho da sua loja."
    : "Gerencie as informações da sua loja em um só lugar.";

  return (
    <div className="app-shell">
      <aside className={"sidebar " + (mobileNav ? "sidebar-open" : "")}>
        <div className="brand">
          <div className="brand-mark"><ShoppingBag size={21} /></div>
          <div><strong>controle<span>store</span></strong><small>GESTÃO COMERCIAL</small></div>
          <button className="icon-button mobile-close" onClick={() => setMobileNav(false)} aria-label="Fechar menu"><X size={18} /></button>
        </div>
        <div className="store-switch">
          <div className="store-avatar">LJ</div>
          <div className="store-info"><strong>Minha loja</strong><span>Plano demonstração</span></div>
          <ChevronDown size={16} className="muted-icon" />
        </div>
        {["Principal", "Operação", "Gestão"].map(group => (
          <div className="nav-group" key={group}>
            <p className="nav-heading">{group}</p>
            {nav.filter(n => n.group === group).map(n => {
              const Icon = n.icon;
              return <button key={n.label} className={"nav-item " + (page === n.label ? "active" : "")}
                onClick={() => { setPage(n.label); setQuery(""); setMobileNav(false); }}>
                <Icon size={18} strokeWidth={1.8} /><span>{n.label}</span>
                {n.label === "Fiados" && <span className="nav-count">2</span>}
              </button>;
            })}
          </div>
        ))}
        <div className="sidebar-bottom">
          <div className="help-card"><div className="help-icon"><Activity size={17} /></div><strong>Precisa de ajuda?</strong><p>Consulte o guia de configuração do sistema.</p><button onClick={() => setPage("Configurações")}>Ver configurações <span>→</span></button></div>
          <div className="user-profile"><div className="user-avatar">MU</div><div className="user-info"><strong>Administrador</strong><span>Conta demonstrativa</span></div><button className="icon-button" aria-label="Sair da demonstração" onClick={() => window.alert("Esta é uma interface demonstrativa. Nenhuma sessão real está conectada.")}><LogOut size={17} /></button></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setMobileNav(true)} aria-label="Abrir menu"><Menu size={21} /></button>
          <div className="breadcrumb"><span>Minha loja</span><span className="crumb-slash">/</span><strong>{page}</strong></div>
          <div className="topbar-actions">
            <div className="searchbox"><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar nesta tela..." aria-label="Buscar nesta tela" /></div>
            <button className="icon-button notification" aria-label="Notificações" onClick={() => window.alert("Você está vendo dados demonstrativos.")}><Bell size={19} /><i /></button>
            <div className="top-avatar">MU</div>
          </div>
        </header>

        <div className="page-content">
          <div className="page-heading">
            <div><div className="eyebrow"><CalendarDays size={14} /> QUARTA-FEIRA, 15 DE OUTUBRO</div><h1>{title}</h1><p>{subtitle}</p></div>
            <div className="heading-actions">
              {page === "Produtos" && <button className="btn btn-secondary" onClick={exportProducts}><Download size={16} /> Exportar</button>}
              {page === "Produtos" && <button className="btn btn-primary" onClick={() => setShowProductForm(true)}><Plus size={17} /> Novo produto</button>}
              {page === "Vendas" && <button className="btn btn-primary" onClick={() => window.alert("A criação de vendas será conectada ao banco na próxima etapa.")}><Plus size={17} /> Nova venda</button>}
            </div>
          </div>

          {page === "Visão geral" && <Dashboard products={products} clients={clients} sales={sales} onNavigate={setPage} />}
          {page === "Produtos" && <Products products={filteredProducts} onDelete={id => setProducts(prev => prev.filter(p => p.id !== id))} />}
          {page === "Clientes" && <Clients clients={filteredClients} />}
          {page === "Vendas" && <Sales sales={filteredSales} />}
          {page === "Fiados" && <Debts clients={clients} />}
          {page === "Caixa" && <Cash sales={sales} />}
          {page === "Orçamentos" && <SimplePage icon={<ClipboardList size={23} />} heading="Orçamentos" text="Organize propostas e acompanhe as oportunidades antes de fechar uma venda." action="Criar orçamento" />}
          {page === "Relatórios" && <Reports products={products} sales={sales} />}
          {page === "Equipe" && <SimplePage icon={<Users size={23} />} heading="Equipe da loja" text="A gestão de colaboradores e permissões será configurada quando a autenticação estiver conectada." action="Configurar equipe" />}
          {page === "Configurações" && <SimplePage icon={<Settings size={23} />} heading="Configurações" text="Conecte seu projeto Supabase e configure autenticação, dados da loja e regras de acesso antes de usar informações reais." action="Ver instruções" />}
        </div>
        <footer className="footer"><span>© 2026 Controle Store · Projeto independente</span><span><i className="status-dot" /> Ambiente demonstrativo</span></footer>
      </main>

      {showProductForm && <div className="modal-backdrop" onClick={() => setShowProductForm(false)}>
        <form className="modal" onSubmit={addProduct} onClick={e => e.stopPropagation()}>
          <div className="modal-header"><div><h2>Novo produto</h2><p>Adicione um item ao catálogo demonstrativo.</p></div><button type="button" className="icon-button" onClick={() => setShowProductForm(false)} aria-label="Fechar"><X size={19} /></button></div>
          <label>Nome do produto<input autoFocus required value={productName} onChange={e => setProductName(e.target.value)} placeholder="Ex.: Camiseta básica" /></label>
          <div className="form-grid"><label>Preço (R$)<input type="number" min="0" step="0.01" required value={productPrice} onChange={e => setProductPrice(e.target.value)} /></label><label>Estoque inicial<input type="number" min="0" step="1" required value={productStock} onChange={e => setProductStock(e.target.value)} /></label></div>
          <div className="demo-note">Este cadastro fica apenas no estado desta página e não é salvo no banco de dados.</div>
          <div className="modal-actions"><button type="button" className="btn btn-secondary" onClick={() => setShowProductForm(false)}>Cancelar</button><button type="submit" className="btn btn-primary"><Check size={16} /> Adicionar produto</button></div>
        </form>
      </div>}
    </div>
  );
}

function Dashboard({ products, clients, sales, onNavigate }: { products: Item[]; clients: Client[]; sales: Sale[]; onNavigate: (p: string) => void }) {
  const revenue = sales.filter(s => s.status === "Pago").reduce((sum, s) => sum + s.total, 0);
  const debts = clients.reduce((sum, c) => sum + c.balance, 0);
  return <>
    <div className="demo-banner"><div className="banner-icon"><Activity size={18} /></div><div><strong>Bem-vindo ao seu painel de gestão</strong><p>Os números abaixo são dados de exemplo para você conhecer a interface.</p></div><span className="demo-pill">DEMO</span></div>
    <div className="stats-grid">
      <StatCard title="Vendas registradas" value={String(sales.length + 124)} detail="vs. período anterior" trend="+12,8%" positive icon={<ShoppingCart size={19} />} />
      <StatCard title="Receita demonstrativa" value={money(revenue + 12840)} detail="vs. período anterior" trend="+8,2%" positive icon={<CircleDollarSign size={20} />} />
      <StatCard title="Produtos cadastrados" value={String(products.length + 86)} detail={products.filter(p => p.stock <= 7).length + " itens com estoque baixo"} trend="Acompanhar" icon={<Boxes size={19} />} />
      <StatCard title="Valores em aberto" value={money(debts)} detail="Saldos demonstrativos" trend="2 clientes" icon={<CreditCard size={19} />} />
    </div>
    <div className="dashboard-grid">
      <section className="panel sales-panel"><div className="panel-header"><div><h2>Vendas recentes</h2><p>Últimas movimentações da loja</p></div><button className="text-button" onClick={() => onNavigate("Vendas")}>Ver todas <span>→</span></button></div>
        <div className="table-wrap"><table><thead><tr><th>Pedido</th><th>Cliente</th><th>Data</th><th>Valor</th><th>Status</th></tr></thead><tbody>{sales.slice(0, 4).map(s => <tr key={s.id}><td className="order-id">{s.id}</td><td>{s.client}</td><td className="muted-cell">{s.date}</td><td className="money-cell">{money(s.total)}</td><td><span className={"status " + (s.status === "Pago" ? "paid" : "pending")}>{s.status}</span></td></tr>)}</tbody></table></div>
      </section>
      <section className="panel inventory-panel"><div className="panel-header"><div><h2>Estoque em atenção</h2><p>Produtos para revisar</p></div><button className="icon-button" aria-label="Abrir produtos" onClick={() => onNavigate("Produtos")}><ArrowUpRight size={17} /></button></div>
        <div className="inventory-list">{products.filter(p => p.stock <= 18).slice(0, 4).map(p => <div className="inventory-item" key={p.id}><div className="product-thumb"><Package size={18} /></div><div className="inventory-name"><strong>{p.name}</strong><span>{p.category}</span></div><div className={"stock-badge " + (p.stock === 0 ? "stock-out" : p.stock <= 7 ? "stock-low" : "")}>{p.stock === 0 ? "Sem estoque" : p.stock + " un."}</div></div>)}</div>
        <button className="wide-link" onClick={() => onNavigate("Produtos")}>Ver inventário completo <span>→</span></button>
      </section>
    </div>
    <section className="quick-actions"><div><h2>Acesso rápido</h2><p>Atalhos para tarefas frequentes</p></div><div className="quick-grid">
      <button onClick={() => onNavigate("Produtos")}><span className="quick-icon purple"><Package size={19} /></span><strong>Produtos</strong><small>Gerenciar catálogo</small></button>
      <button onClick={() => onNavigate("Clientes")}><span className="quick-icon blue"><Users size={19} /></span><strong>Clientes</strong><small>Ver cadastros</small></button>
      <button onClick={() => onNavigate("Vendas")}><span className="quick-icon green"><ShoppingCart size={19} /></span><strong>Vendas</strong><small>Acompanhar pedidos</small></button>
      <button onClick={() => onNavigate("Relatórios")}><span className="quick-icon orange"><BarChart3 size={19} /></span><strong>Relatórios</strong><small>Ver desempenho</small></button>
    </div></section>
  </>;
}

function StatCard({ title, value, detail, trend, positive, icon }: { title: string; value: string; detail: string; trend: string; positive?: boolean; icon: React.ReactNode }) {
  return <section className="stat-card"><div className="stat-top"><span>{title}</span><span className="stat-icon">{icon}</span></div><strong className="stat-value">{value}</strong><div className="stat-bottom"><span className={"stat-trend " + (positive ? "positive" : "")}>{positive && <ArrowUpRight size={13} />}{trend}</span><span>{detail}</span></div></section>;
}

function Products({ products, onDelete }: { products: Item[]; onDelete: (id: number) => void }) {
  return <section className="panel data-panel"><div className="panel-header"><div><h2>Catálogo de produtos</h2><p>{products.length} itens encontrados · demonstração local</p></div><button className="filter-button" onClick={() => window.alert("Filtros avançados serão implementados em uma próxima etapa.")}><SlidersHorizontal size={16} /> Filtros</button></div>
    <div className="table-wrap"><table><thead><tr><th>Produto</th><th>Categoria</th><th>Preço</th><th>Estoque</th><th>Situação</th><th></th></tr></thead><tbody>{products.map(p => <tr key={p.id}><td><div className="table-product"><div className="product-thumb"><Package size={17} /></div><div><strong>{p.name}</strong><small>SKU-{String(p.id).padStart(4, "0")}</small></div></div></td><td>{p.category}</td><td className="money-cell">{money(p.price)}</td><td>{p.stock} un.</td><td><span className={"status " + (p.stock === 0 ? "pending" : p.stock <= 7 ? "low-status" : "paid")}>{p.stock === 0 ? "Esgotado" : p.stock <= 7 ? "Estoque baixo" : "Disponível"}</span></td><td><button className="icon-button" title="Remover da lista demonstrativa" onClick={() => onDelete(p.id)}><X size={16} /></button></td></tr>)}</tbody></table>{products.length === 0 && <div className="empty-state">Nenhum produto encontrado. Tente outra busca.</div>}</div>
  </section>;
}

function Clients({ clients }: { clients: Client[] }) {
  return <section className="panel data-panel"><div className="panel-header"><div><h2>Base de clientes</h2><p>{clients.length} clientes demonstrativos</p></div><button className="btn btn-primary" onClick={() => window.alert("Cadastro de clientes será conectado ao banco na próxima etapa.")}><Plus size={16} /> Novo cliente</button></div>
    <div className="table-wrap"><table><thead><tr><th>Cliente</th><th>Telefone</th><th>Saldo em aberto</th><th>Situação</th></tr></thead><tbody>{clients.map(c => <tr key={c.id}><td><div className="table-product"><div className="client-avatar">{c.name.split(" ").map(n => n[0]).slice(0,2).join("")}</div><strong>{c.name}</strong></div></td><td>{c.phone}</td><td className="money-cell">{money(c.balance)}</td><td><span className={"status " + (c.balance > 0 ? "pending" : "paid")}>{c.balance > 0 ? "Possui débito" : "Em dia"}</span></td></tr>)}</tbody></table>{clients.length === 0 && <div className="empty-state">Nenhum cliente encontrado.</div>}</div>
  </section>;
}

function Sales({ sales }: { sales: Sale[] }) {
  return <section className="panel data-panel"><div className="panel-header"><div><h2>Histórico de vendas</h2><p>Transações fictícias para visualização</p></div><button className="filter-button" onClick={() => window.alert("Filtros por período estarão disponíveis na integração.")}><SlidersHorizontal size={16} /> Filtrar período</button></div>
    <div className="table-wrap"><table><thead><tr><th>Pedido</th><th>Cliente</th><th>Data</th><th>Valor total</th><th>Status</th></tr></thead><tbody>{sales.map(s => <tr key={s.id}><td className="order-id">{s.id}</td><td>{s.client}</td><td className="muted-cell">{s.date}</td><td className="money-cell">{money(s.total)}</td><td><span className={"status " + (s.status === "Pago" ? "paid" : "pending")}>{s.status}</span></td></tr>)}</tbody></table>{sales.length === 0 && <div className="empty-state">Nenhuma venda encontrada.</div>}</div>
  </section>;
}

function Debts({ clients }: { clients: Client[] }) {
  const owing = clients.filter(c => c.balance > 0);
  const total = owing.reduce((sum, c) => sum + c.balance, 0);
  return <><div className="stats-grid two-stats"><StatCard title="Total em aberto" value={money(total)} detail="Saldos fictícios" trend="A receber" icon={<CreditCard size={20} />} /><StatCard title="Clientes com saldo" value={String(owing.length)} detail="Na base de demonstração" trend="Acompanhar" icon={<Users size={20} />} /></div><Clients clients={owing} /></>;
}

function Cash({ sales }: { sales: Sale[] }) {
  const paid = sales.filter(s => s.status === "Pago").reduce((sum, s) => sum + s.total, 0);
  return <><div className="stats-grid two-stats"><StatCard title="Entradas demonstrativas" value={money(paid)} detail="Vendas marcadas como pagas" trend="Entradas" positive icon={<ArrowDownRight size={20} />} /><StatCard title="Saldo de caixa" value={money(paid)} detail="Sem despesas registradas" trend="Estimado" icon={<Wallet size={20} />} /></div><section className="panel data-panel"><div className="panel-header"><div><h2>Movimentações do caixa</h2><p>Resumo de vendas pagas na demonstração</p></div></div><div className="table-wrap"><table><thead><tr><th>Referência</th><th>Descrição</th><th>Data</th><th>Valor</th><th>Tipo</th></tr></thead><tbody>{sales.filter(s => s.status === "Pago").map(s => <tr key={s.id}><td className="order-id">{s.id}</td><td>Venda de mercadoria</td><td className="muted-cell">{s.date}</td><td className="money-cell">{money(s.total)}</td><td><span className="status paid">Entrada</span></td></tr>)}</tbody></table></div></section></>;
}

function Reports({ products, sales }: { products: Item[]; sales: Sale[] }) {
  const max = Math.max(...sales.map(s => s.total), 1);
  return <section className="panel report-panel"><div className="panel-header"><div><h2>Resumo de desempenho</h2><p>Valores ilustrativos, sem conexão com vendas reais</p></div></div><div className="report-summary"><div><span>Vendas exibidas</span><strong>{sales.length}</strong></div><div><span>Valor de vendas pagas</span><strong>{money(sales.filter(s => s.status === "Pago").reduce((a, s) => a + s.total, 0))}</strong></div><div><span>Itens no catálogo</span><strong>{products.length}</strong></div></div><h3 className="chart-title">Vendas por pedido</h3><div className="bar-chart">{sales.map(s => <div className="bar-row" key={s.id}><span>{s.id}</span><div className="bar-track"><div className="bar-fill" style={{ width: (s.total / max * 100) + "%" }} /></div><strong>{money(s.total)}</strong></div>)}</div></section>;
}

function SimplePage({ icon, heading, text, action }: { icon: React.ReactNode; heading: string; text: string; action: string }) {
  return <section className="empty-page panel"><div className="empty-illustration">{icon}</div><h2>{heading}</h2><p>{text}</p><button className="btn btn-primary" onClick={() => window.alert("Esta área será ampliada na próxima etapa de desenvolvimento.")}>{action} <ArrowUpRight size={16} /></button><small>Recurso em desenvolvimento · ambiente demonstrativo</small></section>;
}

export default App;
