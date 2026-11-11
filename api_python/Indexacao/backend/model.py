# model_trainer.py

from sentence_transformers import SentenceTransformer, InputExample, losses
from torch.utils.data import DataLoader
from typing import List, Dict
import json
import os

class ModelTrainer:
    def __init__(self, base_model_name: str = 'all-mpnet-base-v2', custom_model_path: str = 'custom_model'):
        """
        Inicializa o treinador do modelo.
        
        Args:
            base_model_name: Nome do modelo base a ser usado
            custom_model_path: Caminho onde o modelo customizado será salvo
        """
        self.base_model_name = base_model_name
        self.custom_model_path = custom_model_path
        self.model = None
        self.training_data = []

    def add_training_example(self, query: str, relevant_text: str, is_relevant: bool = True):
        """
        Adiciona um exemplo de treinamento individual.
        
        Args:
            query: Consulta de busca
            relevant_text: Texto relevante para a consulta
            is_relevant: Indica se o texto é relevante para a consulta
        """
        self.training_data.append({
            "query": query,
            "relevant_text": relevant_text,
            "is_relevant": is_relevant
        })

    def add_training_category(self, category: str, examples: List[Dict[str, str]], negative_examples: List[str] = None):
        """
        Adiciona uma categoria inteira de exemplos de treinamento.
        
        Args:
            category: Nome da categoria (ex: "medicina", "finanças")
            examples: Lista de dicionários com textos relevantes
            negative_examples: Lista opcional de textos não relevantes
        """
        # Adiciona exemplos positivos
        for example in examples:
            self.add_training_example(
                query=example.get("query", category),
                relevant_text=example["text"],
                is_relevant=True
            )
        
        # Adiciona exemplos negativos se fornecidos
        if negative_examples:
            for text in negative_examples:
                self.add_training_example(
                    query=category,
                    relevant_text=text,
                    is_relevant=False
                )

    def prepare_training_data(self) -> List[InputExample]:
        """
        Prepara os dados de treinamento no formato necessário para fine-tuning.
        """
        training_examples = []
        for example in self.training_data:
            label = 1.0 if example["is_relevant"] else 0.0
            training_examples.append(
                InputExample(
                    texts=[f"consulta: {example['query']}", example["relevant_text"]],
                    label=label
                )
            )
        return training_examples

    def train(self, epochs: int = 5, batch_size: int = 4):
        """
        Realiza o treinamento do modelo com os exemplos fornecidos.
        """
        if not self.training_data:
            raise ValueError("Nenhum dado de treinamento foi adicionado!")

        if self.model is None:
            self.model = SentenceTransformer(self.base_model_name)

        training_examples = self.prepare_training_data()
        train_dataloader = DataLoader(training_examples, shuffle=True, batch_size=batch_size)
        train_loss = losses.CosineSimilarityLoss(self.model)

        print(f"Iniciando treinamento com {len(training_examples)} exemplos...")
        
        self.model.fit(
            train_objectives=[(train_dataloader, train_loss)],
            epochs=epochs,
            warmup_steps=100,
            show_progress_bar=True
        )

        # Salva o modelo treinado
        self.model.save(self.custom_model_path)
        print(f"Modelo salvo em: {self.custom_model_path}")
        
        # Opcionalmente, salva os dados de treinamento para referência
        with open(f"{self.custom_model_path}/training_data.json", "w", encoding="utf-8") as f:
            json.dump(self.training_data, f, ensure_ascii=False, indent=2)

    def load_training_data(self, file_path: str):
        """
        Carrega dados de treinamento de um arquivo JSON.
        """
        with open(file_path, "r", encoding="utf-8") as f:
            self.training_data = json.load(f)


if __name__ == "__main__":
  
    trainer = ModelTrainer()

    # Exemplos religiosos (positivos)
    religious_examples = [
        {"query": "bíblia", "text": "A Bíblia é composta por 66 livros divididos entre Antigo e Novo Testamento."},
        {"query": "oração", "text": "A oração é uma prática espiritual usada para se conectar com Deus."},
        {"query": "jejum", "text": "O jejum é uma prática comum em várias religiões para purificação espiritual."},
        {"query": "cristo", "text": "Jesus Cristo é considerado o Salvador no cristianismo."},
        {"query": "evangelho", "text": "O evangelho de Mateus narra a vida e os ensinamentos de Jesus."}
    ]

    # Exemplos negativos (não relacionados à religião)
    religious_negative = [
        "Receita de pizza caseira",
        "Como trocar um pneu do carro",
        "Técnicas avançadas de fotografia",
        "Programação em JavaScript para iniciantes"
    ]

    # Adiciona os exemplos ao treinador
    trainer.add_training_category("religião", religious_examples, religious_negative)

# Treina o modelo

    
    # Exemplos individuais
    trainer.add_training_example(
        query="programação python",
        relevant_text="Python é uma linguagem de programação versátil e fácil de aprender.",
        is_relevant=True
    )
    
    # Treina o modelo
    trainer.train(epochs=3)