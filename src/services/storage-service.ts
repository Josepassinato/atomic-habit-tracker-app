
/**
 * Serviço para gerenciar o armazenamento persistente de configurações
 * Um wrapper em torno de localStorage mas que poderia ser facilmente
 * estendido para usar IndexedDB ou outra solução de armazenamento
 */

type StorageKeys = "openai-api-key" | "user" | "admin-openai-api-key" | "language-preference";

class StorageService {
  private storagePrefix = "habitus-";
  
  /**
   * Salva um valor no armazenamento persistente
   */
  setItem(key: StorageKeys, value: any): void {
    try {
      const storageKey = this.storagePrefix + key;
      
      // Armazena como string JSON
      if (typeof value === 'object') {
        localStorage.setItem(storageKey, JSON.stringify(value));
      } else {
        localStorage.setItem(storageKey, String(value));
      }
      
      // Aqui poderia sincronizar com o servidor se necessário
      // this.syncWithServer(key, value);
    } catch (error) {
      console.error(`Erro ao salvar '${key}' no armazenamento:`, error);
    }
  }
  
  /**
   * Obtém um valor do armazenamento persistente
   */
  getItem<T>(key: StorageKeys, defaultValue: T | null = null): T | null {
    try {
      const storageKey = this.storagePrefix + key;
      const value = localStorage.getItem(storageKey);
      
      if (value === null) {
        return defaultValue;
      }
      
      // Tenta fazer parse como JSON
      try {
        return JSON.parse(value) as T;
      } catch {
        // Se falhar no parse, retorna como string
        return value as unknown as T;
      }
    } catch (error) {
      console.error(`Erro ao obter '${key}' do armazenamento:`, error);
      return defaultValue;
    }
  }
  
  /**
   * Remove um item do armazenamento
   */
  removeItem(key: StorageKeys): void {
    try {
      const storageKey = this.storagePrefix + key;
      localStorage.removeItem(storageKey);
      
      // Aqui poderia sincronizar com o servidor se necessário
      // this.removeFromServer(key);
    } catch (error) {
      console.error(`Erro ao remover '${key}' do armazenamento:`, error);
    }
  }
  
  /**
   * Verifica se uma chave existe no armazenamento
   */
  hasItem(key: StorageKeys): boolean {
    const storageKey = this.storagePrefix + key;
    return localStorage.getItem(storageKey) !== null;
  }
}

// Exporta uma instância única do serviço
export const storageService = new StorageService();
