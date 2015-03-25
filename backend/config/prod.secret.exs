use Mix.Config

# In this file, we keep production configuration that
# you likely want to automate and keep it away from
# your version control system.
config :george, George.Endpoint,
  secret_key_base: "PsPP8zOyffy8E3zVqKPlMIaYF7UHNSp5TsZLjN0wzXBSesfACtT7z1VPdkdc5Ues"

# Configure your database
config :george, George.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "george_prod"
