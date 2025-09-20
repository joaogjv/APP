// Importa o ícone FontAwesome do pacote de ícones do Expo
import { Feather, FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, View, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Obtém a largura da tela do dispositivo
const { width } = Dimensions.get('window'); // Usado para definir largura das imagens do carrossel

const colors = {
  branco: '#ffffff', 
  rosa: '#ff0080',   
  gelo: '#f1f1f1',   
  preto: '#2a2a2a',  
};

const carouselImages = [
  require('../../assets/images/brigadeiro_de_formatura.png'),
  require('../../assets/images/brigadeiro_natalino.png'),
  require('../../assets/images/brigadeiros_coloridos.png'),
  require('../../assets/images/amor.png'),
  require('../../assets/images/combo.png'),
  require('../../assets/images/coracao_de_brigadeiro.png'),
  require('../../assets/images/cha.png'),
];

const produtos = [
  {
    nome: 'coração de brigadeiro',
    preco: 'R$ 25,00',
    img: require('../../assets/images/foto sem fundo do coracao.png'),
  },
  {
    nome: 'Prato de Brigadeiro',
    preco: 'R$ 40,00',
    img: require('../../assets/images/venda sem fundo do prato.png'),
  },
  {
    nome: 'Caixa de Brigadeiros',
    preco: 'R$ 30,00',
    img: require('../../assets/images/caixa_de_brigadeiros.png'),
  },
  {
    nome: 'Brigadeiros Natalinos',
    preco: 'R$ 50,00',
    img: require('../../assets/images/combo natalino.png'),
  },
];

interface IndexProps {
  setUserToken?: (token: string | null) => void;
}

// Removido SQLite, usaremos apenas AsyncStorage

export default function Index({ setUserToken }: IndexProps) {
  // Função para formatar CPF
  function formatCpf(value: string) {
    const onlyNums = value.replace(/\D/g, "");
    let formatted = onlyNums;
    if (formatted.length > 3) formatted = formatted.slice(0, 3) + '.' + formatted.slice(3);
    if (formatted.length > 7) formatted = formatted.slice(0, 7) + '.' + formatted.slice(7);
    if (formatted.length > 11) formatted = formatted.slice(0, 11) + '-' + formatted.slice(11);
    return formatted.slice(0, 14);
  }

  // Função para formatar CEP
  function formatCep(value: string) {
    const onlyNums = value.replace(/\D/g, "");
    let formatted = onlyNums;
    if (formatted.length > 5) formatted = formatted.slice(0, 5) + '-' + formatted.slice(5);
    return formatted.slice(0, 9);
  }
  const carouselRef = useRef<ScrollView>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedUser, setLoggedUser] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); // Novo estado para o e-mail
  const [name, setName] = useState(''); // Novo estado para o nome
  const [cpf, setCpf] = useState(''); // Novo estado para o CPF
  const [cep, setCep] = useState(''); // Novo estado para o CEP
  const [isRegistering, setIsRegistering] = useState(false); // Novo estado para controle de registro
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar senha
  const [keepLogged, setKeepLogged] = useState(false); // Novo estado para manter logado
  // Estado para aba ativa
  const [activeTab, setActiveTab] = useState<'home' | 'encomendas' | 'perfil'>('home');

  const stopAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startAutoScroll = () => {
    stopAutoScroll();
    intervalRef.current = setInterval(() => {
      setCarouselIndex(prev => {
        const next = prev + 1 < carouselImages.length ? prev + 1 : 0;
        if (carouselRef.current) {
          carouselRef.current.scrollTo({ x: next * width * 0.9, animated: true });
        }
        return next;
      });
    }, 3000);
  };

  useEffect(() => {
    // Não restaura login automático ao abrir o app
    startAutoScroll();
    return () => {
      stopAutoScroll();
      AsyncStorage.removeItem('loggedUser');
      setUsername('');
      setPassword('');
    };
  }, []);

  const handleRegister = () => {
    if (email && name && cpf && cep && username && password) {
      AsyncStorage.getItem('users').then((data) => {
        let users = data ? JSON.parse(data) : [];
        if (users.some((u: any) => u.username === username)) {
          alert('Nome de usuário já existe!');
          return;
        }
        users.push({ email, name, cpf, cep, username, password });
        AsyncStorage.setItem('users', JSON.stringify(users)).then(() => {
          // Login automático após registro
          setIsLoggedIn(true);
          setLoggedUser(username);
          if (keepLogged) {
            AsyncStorage.setItem('loggedUser', username);
          }
          setEmail(''); setName(''); setCpf(''); setCep(''); setUsername(''); setPassword('');
          setIsRegistering(false);
        });
      });
    } else {
      alert('Preencha todos os campos!');
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Preencha usuário e senha!");
      return;
    }
    try {
      const data = await AsyncStorage.getItem('users');
      const users = data ? JSON.parse(data) : [];
      const user = users.find((u: any) => u.username === username && u.password === password);
      if (user) {
        setIsLoggedIn(true);
        setLoggedUser(user.username);
        await AsyncStorage.setItem('loggedUser', user.username);
        console.log("Login bem-sucedido!");
      } else {
        alert("Usuário ou senha incorretos!");
      }
    } catch (error: any) {
      console.log("Erro ao realizar login:", error);
    }
  };

  const clearAsyncStorage = async () => {
  await AsyncStorage.removeItem('loggedUser');
  setIsLoggedIn(false);
  setLoggedUser(null);
  setUsername('');  // limpa usuário
  setPassword('');  // limpa senha
  console.log('Logout realizado.');
  };

  const switchToRegister = () => {
    setEmail('');
    setName('');
    setCpf('');
    setUsername('');
    setPassword('');
    setIsRegistering(true);
  };

  const handleClearUsers = async () => {
    await AsyncStorage.removeItem('users');
    alert('Todos os registros foram apagados!');
  };

  if (isRegistering) {
    return (
      <View style={styles.loginContainer}>
        <Text style={styles.loginTitle}>Registrar</Text>
        <TextInput
          style={styles.loginInput}
          placeholder="E-mail"
          placeholderTextColor="#b3afaf"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.loginInput}
          placeholder="Nome"
          placeholderTextColor="#b3afaf"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.loginInput}
          placeholder="CPF"
          placeholderTextColor="#b3afaf"
          value={cpf}
          keyboardType="numeric"
          maxLength={14}
          onChangeText={text => setCpf(formatCpf(text))}
        />
        <TextInput
          style={styles.loginInput}
          placeholder="CEP"
          placeholderTextColor="#b3afaf"
          value={cep}
          keyboardType="numeric"
          maxLength={9}
          onChangeText={text => setCep(formatCep(text))}
        />
        <TextInput
          style={styles.loginInput}
          placeholder="Nome de Usuário"
          placeholderTextColor="#b3afaf"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.loginInput}
          placeholder="Senha"
          placeholderTextColor="#b3afaf"
          value={password}
          onChangeText={setPassword}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <TouchableOpacity
            style={{ marginRight: 8 }}
            onPress={() => setKeepLogged(prev => !prev)}
          >
            <View style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              borderWidth: 2,
              borderColor: colors.rosa,
              backgroundColor: keepLogged ? colors.rosa : colors.branco,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              {keepLogged && <Feather name="check" size={16} color={colors.branco} />}
            </View>
          </TouchableOpacity>
          <Text style={{ color: colors.preto, fontSize: 16 }}>Manter logado</Text>
        </View>
        <View style={styles.loginButtonContainer}>
          <Button title="Registrar" onPress={handleRegister} color={colors.rosa} />
        </View>
        <Text
          style={{ marginTop: 20, color: colors.rosa, textDecorationLine: 'underline' }}
          onPress={() => setIsRegistering(false)}
        >
          Já tem uma conta? Faça login
        </Text>
      </View>
    );
  }

  if (!isLoggedIn) {
    return (
      <View style={styles.loginContainer}>
        <Text style={styles.loginTitle}>Bem-vindo!</Text>
        <TextInput
          style={styles.loginInput}
          placeholder="Usuário"
          placeholderTextColor="#b3afaf"
          value={username}
          onChangeText={setUsername}
        />
        <View style={{ width: '90%', flexDirection: 'row', alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: colors.gelo, borderRadius: 25, paddingHorizontal: 15, backgroundColor: colors.branco }}>
          <TextInput
            style={{ flex: 1, height: 50, fontSize: 16, color: colors.preto }}
            placeholder="Senha"
            placeholderTextColor="#b3afaf"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
            <Feather name={showPassword ? 'eye-off' : 'eye'} size={24} color="#b3afaf" />
          </TouchableOpacity>
        </View>
        <View style={styles.loginButtonContainer}>
          <Button title="Entrar" onPress={handleLogin} color={colors.rosa} />
        </View>
        <View style={[styles.loginButtonContainer, { marginTop: 10 }]}> {/* Botão de registro */}
          <Button title="Registrar" onPress={switchToRegister} color={colors.rosa} />
        </View>
        <View style={[styles.loginButtonContainer, { marginTop: 10 }]}> {/* Botão de apagar registros */}
          <Button title="Apagar registros" onPress={handleClearUsers} color={colors.preto} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView 
        style={{ flex: 1 }} 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title}>Petit Brigaderia</Text>
        <Button title="Limpar Login (Logout)" onPress={clearAsyncStorage} />
        <View style={styles.searchBarContainer}>
          <View style={styles.searchBarWrapper}>
            <TextInput
              style={styles.searchBar}
              placeholder="o que voce procura?"
              placeholderTextColor="#b3afaf"
            />
            <FontAwesome name="search" size={22} color={colors.preto} style={styles.searchIcon} />
          </View>
        </View>

        <View style={styles.carouselContainer}>
          <ScrollView
            ref={carouselRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselRow}
            onScrollBeginDrag={stopAutoScroll}
            onScrollEndDrag={startAutoScroll}
            onTouchStart={stopAutoScroll}
            onTouchEnd={startAutoScroll}
          >
            {carouselImages.map((img, idx) => (
              <Image key={idx} source={img} style={styles.carouselImage} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.saboresRow}>
          <Text style={styles.saboresText}>Sabores</Text>
          <View style={styles.verTodosContainer}>
            <Text style={styles.verTodosText}>ver todos os sabores</Text>
            <Feather name="arrow-right" size={22} color={colors.rosa} />
          </View>
        </View>

        <View style={styles.saboresCarrosselContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.saboresCarrosselRow}
          >
            {['Brigadeiro', 'Beijinho', 'Coco', 'Morango', 'Paçoca', 'Ovomaltine', 'Nutella'].map((sabor, idx) => (
              <View key={idx} style={styles.saborButton}>
                <Text style={styles.saborButtonText}>{sabor}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.produtosContainer}>
          {produtos.map((produto, idx) => (
            <View key={idx} style={styles.produtoCard}>
              <Image source={produto.img} style={styles.produtoImg} />
              <Text style={styles.produtoNome}>{produto.nome}</Text>
              <Text style={styles.produtoPreco}>{produto.preco}</Text>
            </View>
          ))}
        </View>

        <View style={styles.shoppingButton}>
          <MaterialIcons name="shopping-cart" size={30} color={colors.rosa} />
        </View>
      </ScrollView>
      <View style={styles.ifoodTabBar}>
        <TouchableOpacity
          style={[styles.ifoodTabButton, activeTab === 'home' && styles.ifoodTabButtonActive]}
          onPress={() => setActiveTab('home')}
        >
          <MaterialIcons name="home" size={32} color={activeTab === 'home' ? colors.rosa : colors.preto} />
          <Text style={[styles.ifoodTabButtonText, activeTab === 'home' && { color: colors.rosa }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.ifoodTabButton, activeTab === 'encomendas' && styles.ifoodTabButtonActive]}
          onPress={() => setActiveTab('encomendas')}
        >
          <MaterialCommunityIcons name="package-variant" size={32} color={activeTab === 'encomendas' ? colors.rosa : colors.preto} />
          <Text style={[styles.ifoodTabButtonText, activeTab === 'encomendas' && { color: colors.rosa }]}>Encomendas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.ifoodTabButton, activeTab === 'perfil' && styles.ifoodTabButtonActive]}
          onPress={() => setActiveTab('perfil')}
        >
          <FontAwesome name="user" size={30} color={activeTab === 'perfil' ? colors.rosa : colors.preto} />
          <Text style={[styles.ifoodTabButtonText, activeTab === 'perfil' && { color: colors.rosa }]}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  //estilo do container de fotos
  fotosContainer: {
    marginTop: 10,
    marginBottom: 10,//
  },
  //configuraçao da linha de fotos
  fotosRow: {
    flexDirection: 'row',//
    alignItems: 'center',//
    paddingHorizontal: 5,
  },
  //estilo de cada foto
  fotoItem: {
    width: 120,
    height: 120,
    borderRadius: 16,
    marginRight: 12,
    resizeMode: 'cover',
    backgroundColor: colors.gelo,
  },
  //estilo do carrossel de sabores
  saboresCarrosselContainer: {
    marginTop: 20,//espaçamento entre a linha sabores e o carrossel de sabores
    marginBottom: 10,//espaçamento entre o carrossel de sabores e o conteudo abaixo
  },
  //configuraçao do carrossel de sabores
  saboresCarrosselRow: {
    flexDirection: 'row',//alinha as imagens em uma linha
    alignItems: 'center',//alinha os itens verticalmente ao centro
    paddingHorizontal: 5,//espaçamento da direita e esquerda
  },
  //estilo dos botões de sabores
  saborButton: {
    borderWidth: 1,//largura da borda
    backgroundColor: colors.gelo,//cor de fundo
    borderRadius: 20,//bordas arredondadas
    paddingVertical: 10,//espaçamento interno vertical
    paddingHorizontal: 20,//espaçamento interno horizontal
    marginRight: 15,//espaçamento entre os botões
    elevation: 0,//elevação para sombra no Android
  },
  //estilo do texto dos botões de sabores
  saborButtonText: {
    color: colors.rosa,//cor do texto
    fontWeight: 'bold',
    fontSize: 15,
  },
  //estilo da linha sabores
  saboresRow: {
    flexDirection: 'row',//alinha os itens em uma linha
    justifyContent: 'space-between',//espaço entre sabores e ver todos
    marginTop: 0,//espaçamento entre o carrossel e a linha sabores
    marginBottom: 0,//espaçamento entre a linha sabores e o conteudo abaixo
    paddingHorizontal: 0,//espaçamento nas laterais
  },
  //estilo do ver todos os sabores
  verTodosContainer: {
    flexDirection: 'row',//alinha os itens em uma linha
    alignItems: 'center',//alinha verticalmente ao centro
    marginRight: 5,//ajuste de posiçao
  },
  //estilo do texto ver todos os sabores
  verTodosText: {
    color: colors.rosa,//cor do texto
    fontSize: 15,//tamanho da fonte
    marginRight: 2,//espaçamento entre o texto e o ícone
    borderColor: colors.rosa,//cor da borda
  },
  //estilo do botao de compras
  shoppingButton: {
  position: 'absolute',
  top: 30,
  right: 25,
  zIndex: 10,
  backgroundColor: colors.branco,
  borderRadius: 20,
  padding: 6,
  elevation: 3,
  color: colors.rosa,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  flexDirection: 'row',
  alignItems: 'center',
  },
  container: { backgroundColor: colors.branco, padding: 20, paddingBottom: 100 }, // Espaço extra para o rodapé
  title: {
    //configuraçao do titulo
    fontSize: 28, //tamanho da fonte
    fontWeight: 'bold', //negrito
    color: colors.rosa,//cor do titulo
    marginLeft: -10,//ajuste de posiçao de direita para esquerda
    marginTop: 15,//ajuste de altura
    marginBottom: 15,//espaçamento entre o titulo e o carrossel
  },
  searchBarContainer: {
    //configuraçao da barra de pesquisa
    alignItems: 'center',
    marginBottom: 20, // espaçamento entre a barra de pesquisa e o carrossel
  },
  //posicionamento da barra de pesquisa
  searchBarWrapper: {
    position: 'relative',
    width: '100%', // largura da barra de pesquisa
    justifyContent: 'center',
  },
  searchBar: {
    //aparencia do campo de pesquisa
    width: '100%',
    height: 40,//altura da barra de pesquisa
    borderColor: colors.preto,//cor da borda
    borderWidth: 1,//largura da borda
    borderRadius: 20,//borda arredondada
    paddingHorizontal: 12,//espaçamento interno do texto
    fontSize: 16,//tamanho da fonte
    backgroundColor: colors.branco,//cor de fundo
    color: colors.preto,//cor do texto digitado
  },


  //posição do ícone de pesquisa
  searchIcon: {
    position: 'absolute',//posição absoluta dentro do campo de pesquisa
    right: 15,//distancia da direita
    top: '50%',//centralizado verticalmente
    transform: [{ translateY: -11 }],//ajuste fino para centralizar
    zIndex: 1,//garante que o ícone fique acima do campo de texto
  },


  carouselContainer: {
    marginBottom: 10, // controla a distância para o texto "Sabores"
  },
  //configuraçao do carrossel
  carouselRow: {
    paddingHorizontal: 0,//espaçamento da direita e esquerda
    flexDirection: 'row',//alinha as imagens em uma linha
  },
  //estilo das imagens do carrossel
  carouselImage: {
    width: width * 0.9,//largura da imagem (90% da largura da tela)
    height: 250,//altura da imagem
    resizeMode: 'center',//cobre toda a área da imagem
    borderRadius: 20,//bordas arredondadas
    marginRight: 0,//espaçamento entre as imagens
  },
  //configuraçao do texto Sabores
  saboresText: {
    fontSize: 22,//tamanho da fonte
    fontWeight: 'bold',//negrito
    marginLeft: 5,//ajuste de posiçao
    marginTop: 1, // já vai colado no carrossel
  },
  //estilo da lista de produtos
  produtosContainer: {
    marginTop: 10,
    marginBottom: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  //estilo do card de cada produto
  produtoCard: {
    backgroundColor: colors.gelo,//cor de fundo do card
    borderRadius: 18,//bordas arredondadas
    padding: 12,//espaçamento interno
    alignItems: 'center',//alinha o conteudo ao centro
    width: 150,//largura do card
    margin: 17,//espaçamento entre os cards
    elevation: 2,//elevação para sombra no Android
  },
  //estilo da imagem do produto
  produtoImg: {
    width: 90,
    height: 100,
    borderRadius: 12,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  //estilo do nome do produto
  produtoNome: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.preto,
    marginBottom: 4,
    textAlign: 'center',
  },
  //estilo do preço do produto
  produtoPreco: {
    fontSize: 14,
    color: colors.rosa,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  //estilo do container de login
  loginContainer: {
    flex: 1, // ocupa toda a tela
    justifyContent: 'center',//centraliza verticalmente
    alignItems: 'center',// centraliza horizontalmente
    backgroundColor: colors.branco,//cor de fundo
    padding: 20,//espaçamento interno
  },
  //estilo do título de login
  loginTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.rosa,
    marginBottom: 20,
  },
  //estilo dos campos de login
  loginInput: {
    width: '90%',//largura do campo
    height: 50,//altura do campo
    borderColor: colors.gelo,//cor da borda
    borderWidth: 1,//largura da borda
    borderRadius: 25,//bordas arredondadas
    paddingHorizontal: 15,//espaçamento interno horizontal
    fontSize: 16,//tamanho da fonte
    backgroundColor: colors.branco,//cor de fundo
    color: colors.preto,//cor do texto
    marginBottom: 15,//espaçamento entre os campos
    elevation: 2,//elevação para sombra no Android
  },
  //estilo do botão de login
  loginButtonContainer: {
    width: '90%',//largura do botão
    borderRadius: 25,//bordas arredondadas
    overflow: 'hidden',// garante que o botão respeite as bordas arredondadas
  },
  //estilo da barra de navegação inferior
  ifoodTabBar: {
    flexDirection: 'row',//alinha os itens em uma linha
    justifyContent: 'space-between',//espaço entre os botões
    alignItems: 'center',//alinha os itens verticalmente ao centro
    width: '100%',//largura total
    paddingBottom: 24,//espaçamento inferior para área segura
    paddingTop: 6,//espaçamento superior
    backgroundColor: colors.branco,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  ifoodTabButton: {
    flex: 1,
    height: 70,
    marginHorizontal: 8,
    borderRadius: 24,
    backgroundColor: colors.branco,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  ifoodTabButtonActive: {
    backgroundColor: '#fff0f6',
    borderWidth: 2,
    borderColor: colors.rosa,
  },
  ifoodTabButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
    color: colors.preto,
  },
});
