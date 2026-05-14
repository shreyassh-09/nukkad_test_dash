# from pydantic_settings import BaseSettings, SettingsConfigDict

# class Settings(BaseSettings):
#     # Providing a default string bypasses the startup crash if .env is empty
#     SEMRUSH_API_KEY: str = "local_logs_cache_mode"

#     model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

# settings = Settings()
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_SERVICE_ROLE_KEY: str
    SEMRUSH_API_KEY: str = "local_logs_cache_mode"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()