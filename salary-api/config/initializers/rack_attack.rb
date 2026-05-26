class Rack::Attack
  # Throttle all requests by IP to 300 requests per 5 minutes per IP
  throttle('req/ip', limit: 300, period: 5.minutes) do |req|
    req.ip
  end

  # Custom responder returning a clean JSON error for throttled requests
  self.throttled_responder = lambda do |request_env|
    [ 429,
      { 'Content-Type' => 'application/json', 'Retry-After' => '60' },
      [{ error: "Rate limit exceeded. Please try again later." }.to_json]
    ]
  end
end
