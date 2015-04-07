# Is a container which keeps state for a specific webpage. Actually, it only
# stores email md5 hashes of all users currently on a given page
defmodule George.Page do
  @doc """
  Starts a new agent, with an initial state of an empty list
  """
  def start_link do
    Agent.start_link(fn -> [] end)
  end

  @doc """
  Add a new user to the list of currently online users
  """
  def add(page, email) do
    Agent.update(page, fn online -> online ++ [email] end)
  end

  @doc """
  Retrieve all users which are currently online
  """
  def all(page) do
    Agent.get(page, fn online -> online end)
  end

  @doc """
  Removes a user from the list of currently online users
  """
  def remove(page, email) do
    Agent.update(page, fn online -> online -- [email] end)
  end
end
