
import { ArrowRight, Check, Star, Users, TrendingUp, Shield, Zap, BarChart3, Package, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const features = [
  {
    icon: TrendingUp,
    title: "Análise Inteligente",
    description: "IA avançada para otimizar suas vendas e identificar oportunidades de crescimento"
  },
  {
    icon: Users,
    title: "Gestão Multicanal",
    description: "Centralize todos os seus marketplaces em uma única plataforma moderna"
  },
  {
    icon: Shield,
    title: "Segurança Avançada",
    description: "Seus dados protegidos com criptografia de ponta e backups automáticos"
  },
  {
    icon: Zap,
    title: "Automação Completa",
    description: "Automatize processos repetitivos e foque no que realmente importa"
  },
  {
    icon: BarChart3,
    title: "Relatórios Detalhados",
    description: "Dashboards em tempo real com métricas que impulsionam suas decisões"
  },
  {
    icon: Package,
    title: "Gestão de Estoque",
    description: "Controle inteligente de inventário com alertas proativos"
  }
];

const testimonials = [
  {
    name: "Carlos Silva",
    role: "CEO, TechStore",
    content: "O Novura revolucionou nossa operação. Aumentamos 300% as vendas em 6 meses.",
    rating: 5
  },
  {
    name: "Ana Santos",
    role: "Gerente, MegaShop",
    content: "A integração com todos os marketplaces é perfeita. Economizamos 20h por semana.",
    rating: 5
  },
  {
    name: "João Costa",
    role: "Founder, EletroMax",
    content: "A IA do Novura nos ajuda a tomar decisões mais inteligentes todos os dias.",
    rating: 5
  }
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-novura-primary to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Novura</h1>
                <p className="text-xs text-gray-500">ERP Inteligente</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Entrar</Button>
              </Link>
              <Link to="/cadastro">
                <Button className="bg-novura-primary hover:bg-novura-primary/90">
                  Começar Grátis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6 text-center">
          <Badge className="mb-6 bg-novura-primary/10 text-novura-primary border-novura-primary/20">
            🚀 Novo: IA Generativa para E-commerce
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            O ERP Inteligente que
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-novura-primary to-purple-600">
              {" "}Revoluciona{" "}
            </span>
            seu E-commerce
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Gerencie todos os seus marketplaces, estoque, pedidos e finanças em uma única plataforma. 
            Com IA avançada para otimizar suas vendas e automatizar processos.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link to="/cadastro">
              <Button size="lg" className="bg-novura-primary hover:bg-novura-primary/90">
                Começar Grátis Agora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Ver Demonstração
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            ✅ Grátis por 14 dias • ✅ Sem cartão de crédito • ✅ Suporte 24/7
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Funcionalidades que Fazem a Diferença
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Desenvolvido por especialistas em e-commerce para atender todas as suas necessidades
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-novura-primary to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Mais de 10.000 Empresas Confiam no Novura
            </h2>
            <p className="text-gray-600">Veja o que nossos clientes dizem sobre nós</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-novura-primary to-purple-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para Revolucionar seu E-commerce?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Junte-se a milhares de empresas que já transformaram seus negócios com o Novura
          </p>
          <Link to="/cadastro">
            <Button size="lg" className="bg-white text-novura-primary hover:bg-gray-100">
              Começar Grátis Agora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-novura-primary to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold">Novura</span>
              </div>
              <p className="text-gray-400">
                O ERP inteligente que revoluciona o e-commerce brasileiro.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Funcionalidades</li>
                <li>Preços</li>
                <li>Integrações</li>
                <li>API</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Central de Ajuda</li>
                <li>Documentação</li>
                <li>Contato</li>
                <li>Status</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Sobre</li>
                <li>Blog</li>
                <li>Carreiras</li>
                <li>Privacidade</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Novura. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
