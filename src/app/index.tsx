// ...existing code...
// Importa o ícone FontAwesome do pacote de ícones do Expo
import { Feather, FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Modal } from 'react-native';
import { Alert } from 'react-native';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, View, Button, TouchableOpacity } from 'react-native';
import { Animated } from 'react-native';
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



export default function Index({ setUserToken }: IndexProps) {
  // Estado do carrinho de compras
  const [carrinho, setCarrinho] = useState<any[]>([]);

  // Página Carrinho
  const CarrinhoPage = React.memo(() => {
  // Chave Pix fictícia
  const chavePix = 'petitbrigaderia@pix.com';
  const [modalPagamentoVisible, setModalPagamentoVisible] = React.useState(false);
  const [formaPagamento, setFormaPagamento] = React.useState<string | null>(null);
    // Função local para remover item do carrinho
    const handleRemoverItem = (idx: number) => {
      setCarrinho(prev => prev.filter((_, i) => i !== idx));
    };

    // Função para calcular o total do carrinho
    const calcularTotal = () => {
      return carrinho.reduce((acc, item) => {
        // Extrai o valor numérico do preço (R$ xx,xx)
        const preco = parseFloat(item.preco.replace('R$','').replace(',','.').trim());
        return acc + (isNaN(preco) ? 0 : preco);
      }, 0);
    };

    // Função para confirmar compra
    const handleConfirmarCompra = () => {
  if (carrinho.length === 0) return;
  setModalPagamentoVisible(true);
    };

    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#fff6fa' }} contentContainerStyle={{ padding: 24, paddingBottom: 120 }}>
        <Text style={{ fontSize: 30, fontWeight: 'bold', color: colors.rosa, marginBottom: 18, textAlign: 'center', letterSpacing: 1 }}>Carrinho de Compras</Text>
        {carrinho.length === 0 ? (
          <View style={{ backgroundColor: colors.gelo, borderRadius: 18, padding: 32, alignItems: 'center', elevation: 2 }}>
            <FontAwesome name="shopping-cart" size={50} color={colors.rosa} style={{ marginBottom: 12 }} />
            <Text style={{ color: colors.preto, fontSize: 18, fontWeight: 'bold' }}>Seu carrinho está vazio.</Text>
          </View>
        ) : (
          <>
            <View style={{ backgroundColor: colors.gelo, borderRadius: 18, padding: 18, marginBottom: 18, elevation: 2 }}>
              {carrinho.map((item, idx) => (
                <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, backgroundColor: colors.branco, borderRadius: 14, padding: 10, elevation: 1, shadowColor: colors.preto, shadowOpacity: 0.07, shadowRadius: 4 }}>
                  <Image source={item.img} style={{ width: 60, height: 60, borderRadius: 12, marginRight: 14, borderWidth: 2, borderColor: colors.rosa, backgroundColor: colors.gelo }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 17, color: colors.preto, marginBottom: 2 }}>{item.nome}</Text>
                    <Text style={{ color: colors.rosa, fontSize: 16, fontWeight: 'bold' }}>{item.preco}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleRemoverItem(idx)} style={{ marginLeft: 8, padding: 8, flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffe3ef', borderRadius: 10 }}>
                    <FontAwesome name="trash" size={20} color={colors.rosa} />
                    <Text style={{ color: colors.rosa, fontWeight: 'bold', marginLeft: 4 }}>Remover</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            {/* Calculadora de total */}
            <View style={{ marginTop: 8, padding: 22, backgroundColor: '#ffe3ef', borderRadius: 18, alignItems: 'center', elevation: 2, shadowColor: colors.preto, shadowOpacity: 0.09, shadowRadius: 6 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.preto, marginBottom: 6 }}>Total da compra</Text>
              <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.rosa, marginTop: 2, letterSpacing: 1 }}>
                R$ {calcularTotal().toFixed(2).replace('.',',')}
              </Text>
            </View>
            {/* Botão de confirmar compra */}
            <TouchableOpacity
              style={{ marginTop: 28, backgroundColor: colors.rosa, paddingVertical: 16, paddingHorizontal: 40, borderRadius: 30, alignSelf: 'center', elevation: 3, shadowColor: colors.preto, shadowOpacity: 0.12, shadowRadius: 8 }}
              onPress={handleConfirmarCompra}
            >
              <Text style={{ color: colors.branco, fontWeight: 'bold', fontSize: 20, letterSpacing: 1 }}>Confirmar compra</Text>
            </TouchableOpacity>
            {/* Modal de forma de pagamento */}
            <Modal
              visible={modalPagamentoVisible}
              transparent
              animationType="fade"
            >
              <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: colors.gelo, borderRadius: 18, padding: 28, alignItems: 'center', width: 320 }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.rosa, marginBottom: 18 }}>Escolha a forma de pagamento:</Text>
                  {['Pix', 'Dinheiro', 'Crédito'].map(opcao => (
                    <TouchableOpacity
                      key={opcao}
                      style={{ backgroundColor: formaPagamento === opcao ? colors.rosa : colors.branco, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 32, marginBottom: 12, borderWidth: 1, borderColor: colors.rosa, width: '100%' }}
                      onPress={() => setFormaPagamento(opcao)}
                    >
                      <Text style={{ color: formaPagamento === opcao ? colors.branco : colors.rosa, fontSize: 17, fontWeight: 'bold', textAlign: 'center' }}>{opcao}</Text>
                    </TouchableOpacity>
                  ))}
                  {formaPagamento === 'Pix' && (
                    <View style={{ marginTop: 10, marginBottom: 10, alignItems: 'center' }}>
                      <Text style={{ fontSize: 16, color: colors.preto, marginBottom: 4 }}>Chave Pix:</Text>
                      <Text style={{ fontSize: 17, fontWeight: 'bold', color: colors.rosa, marginBottom: 6 }}>{chavePix}</Text>
                      <Text style={{ fontSize: 16, color: colors.preto }}>Valor: R$ {calcularTotal().toFixed(2).replace('.', ',')}</Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={{ backgroundColor: colors.rosa, borderRadius: 16, paddingVertical: 10, paddingHorizontal: 32, marginTop: 10, elevation: 2 }}
                    onPress={() => {
                      if (formaPagamento) {
                        setModalPagamentoVisible(false);
                        setCarrinho([]);
                        if (formaPagamento === 'Pix') {
                          Alert.alert('Compra confirmada!', `Forma de pagamento: Pix\nChave Pix: ${chavePix}\nValor: R$ ${calcularTotal().toFixed(2).replace('.', ',')}`);
                        } else {
                          Alert.alert('Compra confirmada!', 'Forma de pagamento: ' + formaPagamento);
                        }
                        setFormaPagamento(null);
                      } else {
                        Alert.alert('Selecione uma forma de pagamento.');
                      }
                    }}
                  >
                    <Text style={{ color: colors.branco, fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>Confirmar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </>
        )}
      </ScrollView>
    );
  });

  // HomePage memoizado e com auto scroll local
  const HomePage = React.memo(() => {
    // Função para remover item do carrinho
    const handleRemoverItem = (idx: number) => {
      setCarrinho(prev => prev.filter((_, i) => i !== idx));
    };
  // Array de refs para os cards dos produtos
  const produtoRefs = useRef(produtos.map(() => React.createRef<View>())).current;

  // Ref para o carrinho
  const carrinhoRef = useRef<View>(null);
  // Estado do modal do carrinho
  const [showCarrinhoModal, setShowCarrinhoModal] = useState(false);
    const carouselRef = useRef<ScrollView>(null);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
      intervalRef.current = setInterval(() => {
        setCarouselIndex(prev => {
          const next = prev + 1 < carouselImages.length ? prev + 1 : 0;
          if (carouselRef.current) {
            carouselRef.current.scrollTo({ x: next * width * 0.9, animated: true });
          }
          return next;
        });
      }, 3000);
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }, []);

    // Adiciona produto ao carrinho sem animação
    const handleComparar = (produto: any) => {
      setCarrinho(prev => [...prev, produto]);
      Alert.alert('Produto adicionado ao carrinho!', `${produto.nome} foi adicionado para comparação.`);
    };

    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#fff6fa' }} contentContainerStyle={{ padding: 24, paddingBottom: 120 }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: colors.rosa, marginBottom: 18, textAlign: 'center', letterSpacing: 1 }}>Petit Brigaderia</Text>
        <View style={{ alignItems: 'center', marginBottom: 22 }}>
          <View style={{ position: 'relative', width: '100%' }}>
            <TextInput
              style={{ width: '100%', height: 44, borderColor: colors.rosa, borderWidth: 2, borderRadius: 22, paddingHorizontal: 16, fontSize: 17, backgroundColor: colors.branco, color: colors.preto, elevation: 2 }}
              placeholder="O que você procura?"
              placeholderTextColor="#b3afaf"
            />
            <FontAwesome name="search" size={22} color={colors.rosa} style={{ position: 'absolute', right: 18, top: '50%', transform: [{ translateY: -11 }], zIndex: 1 }} />
          </View>
        </View>
        <View style={{ marginBottom: 14 }}>
          <ScrollView
            ref={carouselRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ flexDirection: 'row', paddingHorizontal: 0 }}
          >
            {carouselImages.map((img, idx) => (
              <Image key={idx} source={img} style={{ width: width * 0.9, height: 250, resizeMode: 'center', borderRadius: 22, marginRight: 0, borderWidth: 2, borderColor: colors.rosa, backgroundColor: colors.gelo }} />
            ))}
          </ScrollView>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 0, marginBottom: 0, paddingHorizontal: 0 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', marginLeft: 5, marginTop: 1, color: colors.rosa }}>Sabores</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 5 }}>
            <Text style={{ color: colors.rosa, fontSize: 15, marginRight: 2, borderColor: colors.rosa }}>ver todos os sabores</Text>
            <Feather name="arrow-right" size={22} color={colors.rosa} />
          </View>
        </View>
        <View style={{ marginTop: 20, marginBottom: 10 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5 }}
          >
            {['Brigadeiro', 'Beijinho', 'Coco', 'Morango', 'Paçoca', 'Ovomaltine', 'Nutella'].map((sabor, idx) => (
              <View key={idx} style={{ borderWidth: 1, backgroundColor: colors.gelo, borderRadius: 20, paddingVertical: 10, paddingHorizontal: 20, marginRight: 15, elevation: 0 }}>
                <Text style={{ color: colors.rosa, fontWeight: 'bold', fontSize: 15 }}>{sabor}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={{ marginTop: 10, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {produtos.map((produto, idx) => (
              <View
                key={idx}
                ref={produtoRefs[idx]}
                style={{
                  backgroundColor: colors.gelo,
                  borderRadius: 22,
                  padding: 16,
                  alignItems: 'center',
                  width: '48%',
                  marginBottom: 18,
                  elevation: 3,
                  shadowColor: colors.preto,
                  shadowOpacity: 0.09,
                  shadowRadius: 8,
                }}
              >
                <Image source={produto.img} style={{ width: 100, height: 110, borderRadius: 14, marginBottom: 8, resizeMode: 'cover', borderWidth: 2, borderColor: colors.rosa, backgroundColor: colors.branco }} />
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.preto, marginBottom: 4, textAlign: 'center' }}>{produto.nome}</Text>
                <Text style={{ fontSize: 15, color: colors.rosa, fontWeight: 'bold', textAlign: 'center' }}>{produto.preco}</Text>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.gelo, borderRadius: 18, paddingVertical: 8, paddingHorizontal: 16, marginTop: 8, alignSelf: 'center', elevation: 2, borderWidth: 1, borderColor: colors.rosa }} onPress={() => handleComparar(produto)}>

                  <Text style={{ color: colors.rosa, fontWeight: 'bold', fontSize: 15 }}>Comparar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
        {/* Carrinho removido da HomePage */}
      </ScrollView>
    );
  });

  const EncomendasPage: React.FC = () => {
  // Chave Pix fictícia
  const chavePix = 'petitbrigaderia@pix.com';
  const [modalPagamentoVisible, setModalPagamentoVisible] = React.useState(false);
  const [formaPagamento, setFormaPagamento] = React.useState<string | null>(null);
  const produtosEncomenda = [
      {
        nome: 'Brigadeiro 50% cacau',
        img: require('../../assets/images/brigadeiro encomenda.jpg'),
      },
      { nome: 'Brigadeiro com castanha', img: require('../../assets/images/brigadeiro com castanha.jpg'), },
  { nome: 'Beijinho', img: require('../../assets/images/beijinho.png'), },
        { nome: 'Ninho com Nutella', img: require('../../assets/images/Ninho com nutella.png') },
  { nome: 'Castanha', img: require('../../assets/images/castanha.png') },
  { nome: 'Doce de leite', img: require('../../assets/images/Doce de liete.png') },
  { nome: 'Casadinho', img: require('../../assets/images/Casadinho.png') },
  { nome: 'Chocolate branco', img: require('../../assets/images/chocolate branco.png') },
  { nome: 'Chocolate com flocos de arroz', img: require('../../assets/images/Chocolate com flocos de arroz.png') },
  { nome: 'Farinha láctea', img: require('../../assets/images/farinha láctea.png') },
    ];
  const [quantidades, setQuantidades] = React.useState<number[]>(Array(produtosEncomenda.length).fill(0));
    // Persistência das quantidades
    React.useEffect(() => {
      (async () => {
        const salvo = await AsyncStorage.getItem('quantidadesEncomenda');
        if (salvo) {
          try {
            const arr = JSON.parse(salvo);
            if (Array.isArray(arr) && arr.length === produtosEncomenda.length) {
              setQuantidades(arr);
            }
          } catch {}
        }
      })();
    }, []);

    React.useEffect(() => {
      AsyncStorage.setItem('quantidadesEncomenda', JSON.stringify(quantidades));
    }, [quantidades]);

    const alterarQuantidadeDireta = (idx: number, valor: string) => {
      const num = Math.max(0, parseInt(valor) || 0);
      setQuantidades(qs => {
        const novo = [...qs];
        novo[idx] = num;
        return novo;
      });
    };

    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#fff6fa' }} contentContainerStyle={{ padding: 24, paddingBottom: 120 }}>
        <Text style={{ fontSize: 30, fontWeight: 'bold', color: colors.rosa, marginBottom: 18, textAlign: 'center', letterSpacing: 1 }}>Encomenda</Text>
        {produtosEncomenda.map((produto, idx) => (
          <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.gelo, borderRadius: 16, padding: 14, marginBottom: 12, elevation: 2 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              {produto.img && (
                <Image source={produto.img} style={{ width: 48, height: 48, borderRadius: 12, marginRight: 18, backgroundColor: colors.branco, borderWidth: 1, borderColor: colors.rosa }} />
              )}
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.preto, flexShrink: 1 }} numberOfLines={2}>{produto.nome}</Text>
            </View>
            <TextInput
              style={{ width: 60, height: 36, backgroundColor: colors.branco, borderRadius: 10, borderWidth: 1, borderColor: colors.rosa, textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: colors.rosa, marginLeft: 24, paddingVertical: 6, letterSpacing: 1 }}
              keyboardType="numeric"
              value={quantidades[idx] === 0 ? '' : quantidades[idx].toString()}
              onChangeText={valor => alterarQuantidadeDireta(idx, valor)}
              placeholder="Qtd."
              placeholderTextColor={colors.rosa}
              maxLength={4}
            />
          </View>
        ))}

        {/* Calculadora de total */}
        <View style={{ marginTop: 24, backgroundColor: colors.gelo, borderRadius: 16, padding: 18, alignItems: 'center', elevation: 2 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.rosa, marginBottom: 8 }}>Total de unidades: {quantidades.reduce((a, b) => a + b, 0)}</Text>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.preto, marginBottom: 16 }}>
            Valor total: R$ {(quantidades.reduce((a, b) => a + b, 0) * 2).toFixed(2)}
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: colors.rosa, borderRadius: 22, paddingVertical: 14, paddingHorizontal: 38, elevation: 3, marginTop: 8 }}
            onPress={() => {
              setModalPagamentoVisible(true);
            }}
          >
            <Text style={{ color: colors.branco, fontSize: 18, fontWeight: 'bold', letterSpacing: 1 }}>Confirmar pedido</Text>
          </TouchableOpacity>
        {/* Modal de forma de pagamento */}
        <Modal
          visible={modalPagamentoVisible}
          transparent
          animationType="fade"
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: colors.gelo, borderRadius: 18, padding: 28, alignItems: 'center', width: 320 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.rosa, marginBottom: 18 }}>Escolha a forma de pagamento:</Text>
              {['Pix', 'Dinheiro', 'Crédito'].map(opcao => (
                <TouchableOpacity
                  key={opcao}
                  style={{ backgroundColor: formaPagamento === opcao ? colors.rosa : colors.branco, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 32, marginBottom: 12, borderWidth: 1, borderColor: colors.rosa, width: '100%' }}
                  onPress={() => setFormaPagamento(opcao)}
                >
                  <Text style={{ color: formaPagamento === opcao ? colors.branco : colors.rosa, fontSize: 17, fontWeight: 'bold', textAlign: 'center' }}>{opcao}</Text>
                </TouchableOpacity>
              ))}
              {formaPagamento === 'Pix' && (
                <View style={{ marginTop: 10, marginBottom: 10, alignItems: 'center' }}>
                  <Text style={{ fontSize: 16, color: colors.preto, marginBottom: 4 }}>Chave Pix:</Text>
                  <Text style={{ fontSize: 17, fontWeight: 'bold', color: colors.rosa, marginBottom: 6 }}>{chavePix}</Text>
                  <Text style={{ fontSize: 16, color: colors.preto }}>Valor: R$ {(quantidades.reduce((a, b) => a + b, 0) * 2).toFixed(2).replace('.', ',')}</Text>
                </View>
              )}
              <TouchableOpacity
                style={{ backgroundColor: colors.rosa, borderRadius: 16, paddingVertical: 10, paddingHorizontal: 32, marginTop: 10, elevation: 2 }}
                onPress={() => {
                  if (formaPagamento) {
                    setModalPagamentoVisible(false);
                    setQuantidades(Array(produtosEncomenda.length).fill(0));
                    AsyncStorage.setItem('quantidadesEncomenda', JSON.stringify(Array(produtosEncomenda.length).fill(0)));
                    if (formaPagamento === 'Pix') {
                      Alert.alert('Pedido confirmado!', `Forma de pagamento: Pix\nChave Pix: ${chavePix}\nValor: R$ ${(quantidades.reduce((a, b) => a + b, 0) * 2).toFixed(2).replace('.', ',')}`);
                    } else {
                      Alert.alert('Pedido confirmado!', 'Forma de pagamento: ' + formaPagamento);
                    }
                    setFormaPagamento(null);
                  } else {
                    Alert.alert('Selecione uma forma de pagamento.');
                  }
                }}
              >
                <Text style={{ color: colors.branco, fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        </View>
      </ScrollView>
    );
  };

  const PerfilPage = ({ clearAsyncStorage, userData, handleDeleteAccount, handleChangePassword }: {
    clearAsyncStorage: () => void,
    userData: any,
    handleDeleteAccount: () => void,
    handleChangePassword: () => void,
  }) => (
    <ScrollView style={{ flex: 1, backgroundColor: '#f7f7ff' }} contentContainerStyle={{ padding: 24, paddingBottom: 120 }}>
      <Text style={{ fontSize: 30, fontWeight: 'bold', color: colors.rosa, marginBottom: 18, textAlign: 'center', letterSpacing: 1 }}>Perfil</Text>
      {userData ? (
        <View style={{ backgroundColor: colors.gelo, borderRadius: 22, padding: 28, alignItems: 'center', elevation: 3, shadowColor: colors.preto, shadowOpacity: 0.09, shadowRadius: 8 }}>
          <View style={{ alignItems: 'center', marginBottom: 18 }}>
            <FontAwesome name="user-circle" size={90} color={colors.rosa} style={{ marginBottom: 10, shadowColor: colors.preto, shadowOpacity: 0.12, shadowRadius: 8 }} />
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.rosa, marginBottom: 2 }}>{userData.name}</Text>
          </View>
          {/* Informações alinhadas lado a lado */}
          <View style={{ width: '100%' }}>
            {[{ label: 'E-mail:', value: userData.email },
              { label: 'Celular/Telefone:', value: userData.telefone },
              { label: 'Data de nascimento:', value: userData.nascimento },
              { label: 'CPF:', value: userData.cpf },
              { label: 'CEP:', value: userData.cep },
              { label: 'Endereço:', value: userData.endereco },
              { label: 'Usuário:', value: userData.username }].map((item, idx) => (
                <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, width: '100%' }}>
                  <Text style={{ fontWeight: 'bold', color: colors.preto, fontSize: 16 }}>{item.label}</Text>
                  <Text style={{ color: colors.rosa, fontSize: 16, fontWeight: '500', textAlign: 'right' }}>{item.value}</Text>
                </View>
            ))}
          </View>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.rosa, paddingVertical: 14, paddingHorizontal: 22, borderRadius: 28, marginBottom: 14, width: '80%', alignSelf: 'center', elevation: 2 }} onPress={handleChangePassword}>
            <FontAwesome name="lock" size={22} color={colors.branco} style={{ marginRight: 8 }} />
            <Text style={{ color: colors.branco, fontWeight: 'bold', fontSize: 17 }}>Alterar senha</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.rosa, paddingVertical: 14, paddingHorizontal: 22, borderRadius: 28, marginBottom: 14, width: '80%', alignSelf: 'center', elevation: 2 }} onPress={handleDeleteAccount}>
            <FontAwesome name="trash" size={22} color={colors.branco} style={{ marginRight: 8 }} />
            <Text style={{ color: colors.branco, fontWeight: 'bold', fontSize: 17 }}>Excluir conta</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.rosa, paddingVertical: 14, paddingHorizontal: 22, borderRadius: 28, marginTop: 18, width: '80%', alignSelf: 'center', elevation: 2 }} onPress={clearAsyncStorage}>
            <FontAwesome name="sign-out" size={22} color={colors.branco} style={{ marginRight: 8 }} />
            <Text style={{ color: colors.branco, fontWeight: 'bold', fontSize: 17 }}>Sair</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={{ color: colors.preto, fontSize: 18, textAlign: 'center', marginTop: 40 }}>Nenhum dado de usuário encontrado.</Text>
      )}
    </ScrollView>
  );
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
  // Função para formatar data de nascimento
  function formatNascimento(value: string) {
    const onlyNums = value.replace(/\D/g, "");
    let formatted = onlyNums;
    if (formatted.length > 2) formatted = formatted.slice(0, 2) + '/' + formatted.slice(2);
    if (formatted.length > 5) formatted = formatted.slice(0, 5) + '/' + formatted.slice(5);
    return formatted.slice(0, 10);
  }
  // Função para formatar telefone
  function formatTelefone(value: string) {
    const onlyNums = value.replace(/\D/g, "");
    let formatted = onlyNums;
    if (formatted.length > 2) formatted = '(' + formatted.slice(0, 2) + ') ' + formatted.slice(2);
    return formatted.slice(0, 15);
  }
  const [showEncomendas, setShowEncomendas] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedUser, setLoggedUser] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); // Novo estado para o e-mail
  const [name, setName] = useState(''); // Novo estado para o nome
  const [cpf, setCpf] = useState(''); // Novo estado para o CPF
  const [cep, setCep] = useState(''); // Novo estado para o CEP
  const [endereco, setEndereco] = useState(''); // Novo estado para o endereço
  const [telefone, setTelefone] = useState(''); // Novo estado para telefone/celular
  const [nascimento, setNascimento] = useState(''); // Novo estado para data de nascimento
  const [isRegistering, setIsRegistering] = useState(false); // Novo estado para controle de registro
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar senha
  const [keepLogged, setKeepLogged] = useState(false); // Novo estado para manter logado
  // Estado para aba ativa
  const [activeTab, setActiveTab] = useState<'home' | 'encomenda' | 'perfil' | 'carrinho'>('home');
  // Estado para dados do usuário logado
  const [userData, setUserData] = useState<any | null>(null);

  const handleRegister = () => {
    if (email && name && cpf && cep && endereco && telefone && nascimento && username && password) {
      AsyncStorage.getItem('users').then((data) => {
        let users = data ? JSON.parse(data) : [];
        if (users.some((u: any) => u.username === username)) {
          alert('Nome de usuário já existe!');
          return;
        }
        const newUser = { email, name, cpf, cep, endereco, telefone, nascimento, username, password };
        users.push(newUser);
        AsyncStorage.setItem('users', JSON.stringify(users)).then(() => {
          setIsLoggedIn(true);
          setLoggedUser(username);
          setUserData(newUser); // Salva dados do usuário logado
          if (keepLogged) {
            AsyncStorage.setItem('loggedUser', username);
          }
          setEmail(''); setName(''); setCpf(''); setCep(''); setEndereco(''); setTelefone(''); setNascimento(''); setUsername(''); setPassword('');
          setIsRegistering(false);
          setActiveTab('home'); // Redireciona para Home
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
        setUserData(user); // Salva dados do usuário logado
        await AsyncStorage.setItem('loggedUser', user.username);
        setActiveTab('home'); // Redireciona para Home
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
  setUserData(null); // Limpa dados do usuário logado
  setUsername('');
  setPassword('');
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

  // Estado para modal de senha de exclusão
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  // Função para abrir modal de exclusão
  const handleDeleteAccount = () => {
    setDeletePassword('');
    setShowDeleteModal(true);
  };

  // Função para confirmar exclusão
  const confirmDeleteAccount = async () => {
  if (!deletePassword) {
    Alert.alert('Erro', 'Digite sua senha!');
    return;
  }

  const data = await AsyncStorage.getItem('users');
  let users = data ? JSON.parse(data) : [];
  const user = users.find((u: any) => u.username === loggedUser);

  if (!user) {
    Alert.alert('Erro', 'Usuário não encontrado!');
    return;
  }

  if (user.password !== deletePassword) {
    Alert.alert('Erro', 'Senha incorreta!');
    return;
  }

  // Remove usuário do AsyncStorage
  const filtered = users.filter((u: any) => u.username !== loggedUser);
  await AsyncStorage.setItem('users', JSON.stringify(filtered));

  // Limpa sessão
  await clearAsyncStorage();
  setShowDeleteModal(false);
  Alert.alert('Sucesso', 'Conta excluída!');
};
// Função para alterar senha
const [showChangeModal, setShowChangeModal] = useState(false);
const [currentPassword, setCurrentPassword] = useState('');
const [newPassword, setNewPassword] = useState('');

const handleChangePassword = () => {
  setCurrentPassword('');
  setNewPassword('');
  setShowChangeModal(true);
};

const confirmChangePassword = async () => {
  if (!currentPassword || !newPassword) {
    alert('Preencha os dois campos!');
    return;
  }
  const data = await AsyncStorage.getItem('users');
  let users = data ? JSON.parse(data) : [];
  const idx = users.findIndex((u: any) => u.username === loggedUser);
  if (idx === -1 || users[idx].password !== currentPassword) {
    alert('Senha atual incorreta!');
    return;
  }
  users[idx].password = newPassword;
  await AsyncStorage.setItem('users', JSON.stringify(users));
  setUserData(users[idx]);
  setShowChangeModal(false);
  alert('Senha alterada com sucesso!');
};

  if (isRegistering) {
    // Se acabou de registrar, redireciona para Home
    if (isLoggedIn) {
      setIsRegistering(false);
      setActiveTab('home');
      return null;
    }
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#fff6fa' }} contentContainerStyle={{ padding: 24, paddingBottom: 120, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: colors.rosa, marginBottom: 18, textAlign: 'center', letterSpacing: 1 }}>Registrar</Text>
        <View style={{ width: '100%' }}>
          <TextInput style={{ width: '100%', height: 50, borderColor: colors.rosa, borderWidth: 2, borderRadius: 25, paddingHorizontal: 18, fontSize: 17, backgroundColor: colors.branco, color: colors.preto, marginBottom: 15, elevation: 2 }} placeholder="E-mail" placeholderTextColor="#b3afaf" value={email} onChangeText={setEmail} />
          <TextInput style={{ width: '100%', height: 50, borderColor: colors.rosa, borderWidth: 2, borderRadius: 25, paddingHorizontal: 18, fontSize: 17, backgroundColor: colors.branco, color: colors.preto, marginBottom: 15, elevation: 2 }} placeholder="Nome" placeholderTextColor="#b3afaf" value={name} onChangeText={setName} />
          <TextInput style={{ width: '100%', height: 50, borderColor: colors.rosa, borderWidth: 2, borderRadius: 25, paddingHorizontal: 18, fontSize: 17, backgroundColor: colors.branco, color: colors.preto, marginBottom: 15, elevation: 2 }} placeholder="CPF" placeholderTextColor="#b3afaf" value={cpf} keyboardType="numeric" maxLength={14} onChangeText={text => setCpf(formatCpf(text))} />
          <TextInput style={{ width: '100%', height: 50, borderColor: colors.rosa, borderWidth: 2, borderRadius: 25, paddingHorizontal: 18, fontSize: 17, backgroundColor: colors.branco, color: colors.preto, marginBottom: 15, elevation: 2 }} placeholder="CEP" placeholderTextColor="#b3afaf" value={cep} keyboardType="numeric" maxLength={9} onChangeText={text => setCep(formatCep(text))} />
          <TextInput style={{ width: '100%', height: 50, borderColor: colors.rosa, borderWidth: 2, borderRadius: 25, paddingHorizontal: 18, fontSize: 17, backgroundColor: colors.branco, color: colors.preto, marginBottom: 15, elevation: 2 }} placeholder="Endereço" placeholderTextColor="#b3afaf" value={endereco} onChangeText={setEndereco} />
          <TextInput style={{ width: '100%', height: 50, borderColor: colors.rosa, borderWidth: 2, borderRadius: 25, paddingHorizontal: 18, fontSize: 17, backgroundColor: colors.branco, color: colors.preto, marginBottom: 15, elevation: 2 }} placeholder="Celular/Telefone" placeholderTextColor="#b3afaf" value={telefone} keyboardType="phone-pad" onChangeText={text => setTelefone(formatTelefone(text))} maxLength={15} />
          <TextInput style={{ width: '100%', height: 50, borderColor: colors.rosa, borderWidth: 2, borderRadius: 25, paddingHorizontal: 18, fontSize: 17, backgroundColor: colors.branco, color: colors.preto, marginBottom: 15, elevation: 2 }} placeholder="Data de nascimento (DD/MM/AAAA)" placeholderTextColor="#b3afaf" value={nascimento} keyboardType="numeric" onChangeText={text => setNascimento(formatNascimento(text))} maxLength={10} />
          <TextInput style={{ width: '100%', height: 50, borderColor: colors.rosa, borderWidth: 2, borderRadius: 25, paddingHorizontal: 18, fontSize: 17, backgroundColor: colors.branco, color: colors.preto, marginBottom: 15, elevation: 2 }} placeholder="Nome de Usuário" placeholderTextColor="#b3afaf" value={username} onChangeText={setUsername} />
          <TextInput style={{ width: '100%', height: 50, borderColor: colors.rosa, borderWidth: 2, borderRadius: 25, paddingHorizontal: 18, fontSize: 17, backgroundColor: colors.branco, color: colors.preto, marginBottom: 15, elevation: 2 }} placeholder="Senha" placeholderTextColor="#b3afaf" value={password} onChangeText={setPassword} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginTop: 2 }}>
          <TouchableOpacity style={{ marginRight: 8 }} onPress={() => setKeepLogged(prev => !prev)}>
            <View style={{ width: 24, height: 24, borderRadius: 8, borderWidth: 2, borderColor: colors.rosa, backgroundColor: keepLogged ? colors.rosa : colors.branco, justifyContent: 'center', alignItems: 'center' }}>
              {keepLogged && <Feather name="check" size={16} color={colors.branco} />}
            </View>
          </TouchableOpacity>
          <Text style={{ color: colors.preto, fontSize: 17 }}>Manter logado</Text>
        </View>
        <TouchableOpacity style={{ width: '100%', backgroundColor: colors.rosa, borderRadius: 25, paddingVertical: 14, alignItems: 'center', marginBottom: 8, elevation: 2 }} onPress={handleRegister}>
          <Text style={{ color: colors.branco, fontWeight: 'bold', fontSize: 18 }}>Registrar</Text>
        </TouchableOpacity>
        <Text style={{ marginTop: 20, color: colors.rosa, textDecorationLine: 'underline', fontSize: 16 }} onPress={() => setIsRegistering(false)}>
          Já tem uma conta? Faça login
        </Text>
      </ScrollView>
    );
  }

  if (!isLoggedIn) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff6fa', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: colors.rosa, marginBottom: 18, textAlign: 'center', letterSpacing: 1 }}>Bem-vindo!</Text>
        <View style={{ width: '100%', marginBottom: 12 }}>
          <TextInput style={{ width: '100%', height: 50, borderColor: colors.rosa, borderWidth: 2, borderRadius: 25, paddingHorizontal: 18, fontSize: 17, backgroundColor: colors.branco, color: colors.preto, marginBottom: 15, elevation: 2 }} placeholder="Usuário" placeholderTextColor="#b3afaf" value={username} onChangeText={setUsername} />
          <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', marginBottom: 15, borderWidth: 2, borderColor: colors.rosa, borderRadius: 25, paddingHorizontal: 18, backgroundColor: colors.branco, elevation: 2 }}>
            <TextInput style={{ flex: 1, height: 50, fontSize: 17, color: colors.preto }} placeholder="Senha" placeholderTextColor="#b3afaf" secureTextEntry={!showPassword} value={password} onChangeText={setPassword} />
            <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
              <Feather name={showPassword ? 'eye-off' : 'eye'} size={24} color={colors.rosa} />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={{ width: '100%', backgroundColor: colors.rosa, borderRadius: 25, paddingVertical: 14, alignItems: 'center', marginBottom: 8, elevation: 2 }} onPress={handleLogin}>
          <Text style={{ color: colors.branco, fontWeight: 'bold', fontSize: 18 }}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ width: '100%', backgroundColor: colors.rosa, borderRadius: 25, paddingVertical: 14, alignItems: 'center', marginTop: 10, marginBottom: 8, elevation: 2 }} onPress={switchToRegister}>
          <Text style={{ color: colors.branco, fontWeight: 'bold', fontSize: 18 }}>Registrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ width: '100%', backgroundColor: colors.preto, borderRadius: 25, paddingVertical: 14, alignItems: 'center', marginTop: 10, marginBottom: 8, elevation: 2 }} onPress={handleClearUsers}>
          <Text style={{ color: colors.branco, fontWeight: 'bold', fontSize: 18 }}>Apagar registros</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Renderização das páginas SEM desmontar componentes */}
      <View style={{ flex: 1, display: activeTab === 'home' ? 'flex' : 'none' }}>
        <HomePage />
      </View>
      <View style={{ flex: 1, display: activeTab === 'encomenda' ? 'flex' : 'none' }}>
        <EncomendasPage />
      </View>
      <View style={{ flex: 1, display: activeTab === 'perfil' ? 'flex' : 'none' }}>
        <PerfilPage clearAsyncStorage={clearAsyncStorage} userData={userData} handleDeleteAccount={handleDeleteAccount} handleChangePassword={handleChangePassword} />
        {/* ...modais de perfil... */}
      </View>
      <View style={{ flex: 1, display: activeTab === 'carrinho' ? 'flex' : 'none' }}>
        <CarrinhoPage />
      </View>
      {/* Rodapé fixo */}
      <View style={styles.ifoodTabBar}>
        <TouchableOpacity
          style={[styles.ifoodTabButton, activeTab === 'home' && styles.ifoodTabButtonActive]}
          onPress={() => setActiveTab('home')}
        >
          <MaterialIcons name="home" size={32} color={activeTab === 'home' ? colors.rosa : colors.preto} />
          <Text style={[styles.ifoodTabButtonText, activeTab === 'home' && { color: colors.rosa }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.ifoodTabButton, activeTab === 'encomenda' && styles.ifoodTabButtonActive]}
          onPress={() => setActiveTab('encomenda')}
        >
          <MaterialCommunityIcons name="package-variant" size={32} color={activeTab === 'encomenda' ? colors.rosa : colors.preto} />
          <Text style={[styles.ifoodTabButtonText, activeTab === 'encomenda' && { color: colors.rosa }]}>Encomenda</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.ifoodTabButton, activeTab === 'carrinho' && styles.ifoodTabButtonActive]}
          onPress={() => setActiveTab('carrinho')}
        >
          <MaterialIcons name="shopping-cart" size={30} color={activeTab === 'carrinho' ? colors.rosa : colors.preto} />
          <Text style={[styles.ifoodTabButtonText, activeTab === 'carrinho' && { color: colors.rosa }]}>Carrinho</Text>
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
import Encomendas from './Encomendas';
//estilos globais
const styles = StyleSheet.create({
  carrinhoBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: colors.rosa,
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: colors.branco,
  },
  carrinhoBadgeText: {
    color: colors.branco,
    fontWeight: 'bold',
    fontSize: 14,
  },
  carrinhoContainer: {
    backgroundColor: colors.gelo,
    borderRadius: 18,
    padding: 16,
    marginTop: 18,
    marginBottom: 18,
    elevation: 2,
  },
  carrinhoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: colors.branco,
    borderRadius: 12,
    padding: 8,
    elevation: 1,
  },
  carrinhoImg: {
    width: 60,
    height: 60,
    borderRadius: 10,
    resizeMode: 'cover',
  },
 
  
  //estilo do texto do botao comparar
  compararBtnText: {//estilo do texto do botao comparar
    color: colors.rosa,//cor do texto
    fontWeight: 'bold',//negrito
    fontSize: 15,//tamanho da fonte
  },
  //estilo do container de fotos
  fotosContainer: {
    marginTop: 10,//espaçamento entre o carrossel e o container de fotos
    marginBottom: 10,//espaçamento entre o container de fotos e o conteúdo abaixo
  },
  //configuraçao da linha de fotos
  fotosRow: {
    flexDirection: 'row',//alinha os itens em uma linha
    alignItems: 'center',//alinha os itens verticalmente ao centro
    paddingHorizontal: 5,//espaçamento da direita e esquerda
  },
  //estilo de cada foto
  fotoItem: {
    width: 120,//largura da foto
    height: 120,//altura da foto
    borderRadius: 16,//bordas arredondadas
    marginRight: 12,//espaçamento entre as fotos
    resizeMode: 'cover',//cobre todo o espaço disponivel
    backgroundColor: colors.gelo,//cor de fundo
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
    borderWidth: 2,//largura da borda
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
    justifyContent: 'space-evenly',//espaço igual entre todos os botões
    alignItems: 'center',//alinha os itens verticalmente ao centro
    width: '100%',//largura total
    paddingBottom: 24,//espaçamento inferior para área segura
    paddingTop: 6,//espaçamento superior
    backgroundColor: colors.branco,//cor de fundo
    position: 'absolute',//fixa na parte inferior
    left: 0,//alinha a esquerda
    right: 0,//alinha a direita
    bottom: 0,//posiçao inferior
    zIndex: 99,//garante que fique acima de outros elementos  
    shadowColor: '#070707ff',//cor da sombra
    shadowOffset: { width: 0, height: -2 },//posição da sombra
    shadowOpacity: 0.08,//opacidade da sombra
    shadowRadius: 8,//raio da sombra
    elevation: 8,//elevação para sombra no Android
  },
  //estilo de cada botão da barra de navegação
  ifoodTabButton: {
    flex: 1,//ocupa espaço igual
    height: 80,//altura do botão
    marginHorizontal: 8,//espaçamento horizontal entre os botões
    borderRadius: 24,//bordas arredondadas
    backgroundColor: colors.branco,//cor de fundo
    justifyContent: 'center',//centraliza o conteúdo verticalmente
    alignItems: 'center',//centraliza o conteúdo horizontalmente
    flexDirection: 'column',//alinha o ícone e o texto em coluna
  },
  //estilo do botão ativo
  ifoodTabButtonActive: {
    backgroundColor: '#fff0f6',//cor de fundo do botão ativo
    borderWidth: 1,//largura da borda
    borderColor: colors.rosa,//cor da borda
  },
  //estilo do texto dos botões
  ifoodTabButtonText: {
    fontSize: 14,//tamanho da fonte
    fontWeight: 'bold',//negrito
    marginTop: 2,//espaçamento entre o ícone e o texto
    color: colors.preto,//cor do texto
  },
  //estilo do card de perfil
  perfilCard: {
    backgroundColor: colors.gelo,//cor de fundo do card
    borderRadius: 18,//bordas arredondadas
    padding: 20,//espaçamento interno
    marginBottom: 24,//espaçamento inferior
    alignItems: 'center',//alinha o conteudo ao centro
    elevation: 2,///elevação para sombra no Android
  },
  //estilo do cabeçalho do perfil
  perfilHeader: {
    alignItems: 'center',//alinha o conteudo ao centro
    marginBottom: 16,//espaçamento inferior
  },
  //estilo do nome do usuário
  perfilNome: {
    fontSize: 22,//tamanho da fonte
    fontWeight: 'bold',//negrito
    color: colors.rosa,//cor do texto
    marginBottom: 4,//espaçamento inferior
  },
  //linha de informação do perfil
  perfilInfoRow: {
    flexDirection: 'row',//alinha os itens em uma linha
    justifyContent: 'space-between',//espaço entre label e valor
    width: '100%',//largura total
    marginBottom: 10,//espaçamento inferior
    paddingHorizontal: 10,//espaçamento nas laterais
  },
  //estilo do label da informação
  perfilLabel: {
    fontWeight: 'bold',//negrito
    color: colors.preto,//cor do texto
    fontSize: 16,//tamanho da fonte
  },
  //estilo do valor da informação
  perfilValue: {
    color: colors.rosa,//cor do texto
    fontSize: 16,//tamanho da fonte
    fontWeight: '500',//peso da fonte
    textAlign: 'right',//alinhamento do texto
  },
  // Botões customizados no perfil
  perfilBtnAlterar: {
    flexDirection: 'row',//direção dos itens em linha
    alignItems: 'center', //alinha os itens verticalmente ao centro
    backgroundColor: colors.rosa,//cor de fundo
    paddingVertical: 12,//espaçamento interno vertical
    paddingHorizontal: 18,//  espaçamento interno horizontal
    borderRadius: 25,//bordas arredondadas
    marginBottom: 12,//espaçamento inferior
    width: '80%',//largura do botão
    alignSelf: 'center',//centraliza o botão horizontalmente
    elevation: 2,//elevação para sombra no Android
  },
  //estilo do botão de excluir conta
  perfilBtnExcluir: {
    flexDirection: 'row',//direção dos itens em linha
    alignItems: 'center',// alinha os itens verticalmente ao centro
    backgroundColor: colors.rosa,//cor de fundo
    paddingVertical: 12,//espaçamento interno vertical
    paddingHorizontal: 18,//  espaçamento interno horizontal
    borderRadius: 25,//bordas arredondadas
    width: '80%',//largura do botão
    alignSelf: 'center',//centraliza o botão horizontalmente
    elevation: 2,//elevação para sombra no Android
  },
  //estilo do botão sair
  perfilBtnSair: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.rosa,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 25,
    marginTop: 18,
    width: '80%',
    alignSelf: 'center',
    elevation: 2,
  },
  //estilo do texto dos botões
  perfilBtnText: {
    color: colors.branco,//cor do texto
    fontWeight: 'bold',//negrito
    fontSize: 16,//tamanho da fonte
    marginLeft: 8,//espaçamento entre o ícone e o texto
  },
});