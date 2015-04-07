defmodule George.PageChannel do
  use Phoenix.Channel
  require Logger

  def join("page:" <> page_hash, message, socket) do
    Logger.debug "JOIN #{socket.topic} => #{page_hash} #{inspect message}"

    socket = assign(socket, "name", message["name"])
    socket = assign(socket, "id", message["id"])

    George.Registry.create(George.Registry, page_hash)
    {:ok, page} = George.Registry.lookup(George.Registry, page_hash)
    George.Page.add(page, message["name"])
    reply socket, "join", %{status: "connected", people: George.Page.all(page)}

    broadcast! socket, "user:entered", %{status: "connected", user: message["name"], id: message["id"]}

    {:ok, socket}
  end

  def leave(_reason, socket) do
    Logger.debug "LEAVE #{socket.topic}"

    unregister(socket.topic, socket.assigns["name"])

    broadcast! socket, "user:left", %{status: "leaving", user: socket.assigns["name"], id: socket.assigns["id"]}
    {:ok, socket}
  end

  defp unregister("page:" <> page_hash, email_hash) do
    {:ok, page} = George.Registry.lookup(George.Registry, page_hash)
    :ok = George.Page.remove(page, email_hash)
  end
end
