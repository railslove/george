defmodule George.PageChannel do
  use Phoenix.Channel
  require Logger

  def join("page:" <> page_hash, message, socket) do
    Logger.debug "JOIN #{socket.topic} => #{page_hash} #{inspect message}"
    socket = assign(socket, "name", message["name"])
    socket = assign(socket, "id", message["id"])
    reply socket, "join", %{status: "connected"}
    broadcast! socket, "user:entered", %{status: "connected", user: message["name"], id: message["id"]}
    {:ok, socket}
  end

  def leave(_reason, socket) do
    Logger.debug "LEAVE #{socket.topic}"

    broadcast! socket, "user:left", %{status: "leaving", user: socket.assigns["name"], id: socket.assigns["id"]}
    {:ok, socket}
  end

  # def handle_in("new:msg", message, socket) do
  #   Logger.debug "MSG #{message}"
  #   broadcast! socket, "new:msg", message
  #   {:ok, socket}
  # end

  # def handle_out(event, message, socket) do
  #   Logger.debug "OUT #{message}"
  #   reply socket, event, message
  #   {:ok, socket}
  # end
end
