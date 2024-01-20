import React, { useState } from "react";

const estadoInicial = {
  username: "",
  email: "",
  telefone: "",
  senha: "",
  imagem: null,
};

const FormularioCadastro = () => {
  const [usuario, setUsuario] = useState(estadoInicial);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imagem") {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setUsuario({ ...usuario, imagem: fileReader.result });
      };
      fileReader.readAsDataURL(files[0]);
    } else {
      setUsuario({ ...usuario, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMostrarConfirmacao(true);
  };

  const limparFormulario = () => {
    setUsuario(estadoInicial);
  };

  const handleCancel = () => {
    setMostrarConfirmacao(false);
  };

  const enviarDadosParaBackend = async (dadosUsuario) => {
    try {
      const response = await fetch("https://seu-backend.com/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosUsuario),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Dados enviados com sucesso:", data);
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
    }
  };

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const handleConfirm = async () => {
    if (!validarFormulario()) return;

    setCarregando(true);
    setErro(null);

    try {
      // Aqui continua a lógica já existente de handleConfirm
    } catch (error) {
      setErro("Falha ao enviar os dados. Tente novamente.");
    } finally {
      setCarregando(false);
    }
    // Salva no localStorage
    localStorage.setItem("usuario", JSON.stringify(usuario));
    // Envia para o backend
    await enviarDadosParaBackend(usuario);
    // Limpa o formulário
    limparFormulario();
    // Esconde a confirmação
    setMostrarConfirmacao(false);
  };

  const validarFormulario = () => {
    if (
      !usuario.username ||
      !usuario.email ||
      !usuario.telefone ||
      !usuario.senha
    ) {
      alert("Todos os campos são obrigatórios.");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(usuario.email)) {
      alert("Por favor, insira um email válido.");
      return false;
    }

    // Adicione aqui outras validações necessárias
    return true;
  };

  if (mostrarConfirmacao) {
    // Quando mostrarConfirmacao for true

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center px-4">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-auto my-6">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Confirmação de Dados
          </h2>
          <div className="space-y-3 mb-4">
            <p>
              <span className="font-bold">Nome de Usuário:</span>{" "}
              {usuario.username}
            </p>
            <p>
              <span className="font-bold">Email:</span> {usuario.email}
            </p>
            <p>
              <span className="font-bold">Telefone:</span> {usuario.telefone}
            </p>
            <p>
              <span className="font-bold">Senha:</span> {usuario.senha}
            </p>
          </div>
          {usuario.imagem && (
            <img
              src={usuario.imagem}
              alt="Imagem de perfil"
              className="max-w-full h-auto max-h-65 my-4 mx-auto"
            />
          )}
          <div className="flex justify-between">
            <button
              onClick={() => setMostrarConfirmacao(false)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    );

  } else if (erro) {
    return <div className="error-message">{erro}</div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto my-10 p-8 bg-white shadow-lg rounded-lg"
    >
      <div className="mb-4">
        <label
          htmlFor="username"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Nome de Usuário
        </label>
        <input
          type="text"
          id="username"
          name="username"
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={usuario.username}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={usuario.email}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="telefone"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Telefone
        </label>
        <input
          type="tel"
          id="telefone"
          name="telefone"
          pattern="[0-9]{2} [0-9]{4,5}-[0-9]{4}"
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={usuario.telefone}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="senha"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Senha
        </label>
        <input
          type="password"
          id="senha"
          name="senha"
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={usuario.senha}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="imagem"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Carregar Imagem
        </label>
        <input
          type="file"
          id="imagem"
          name="imagem"
          accept="image/*"
          className="shadow w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          onChange={handleChange}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Cadastrar Usuário
      </button>
    </form>
  );
};

export default FormularioCadastro;
