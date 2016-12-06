package com.github.pvoznenko.api

import akka.http.scaladsl.testkit.ScalatestRouteTest
import org.scalatest.{Matchers, WordSpec}
import spray.json.JsValue


class ParserApiSpec extends WordSpec with Matchers with ScalatestRouteTest with ParserAPI {

  import com.github.pvoznenko.marshallers.SprayJsonSupport._

  "return a segmented query" in {
    Get("/parse?query=test") ~> parserRoutes ~> check {
      val response = responseAs[JsValue]
      response.compactPrint shouldBe "{\"query\":\"test\",\"segmentation\":{\"segments\":[{\"start\":{\"row\":0,\"col\":0,\"offset\":0},\"end\":{\"row\":0,\"col\":3,\"offset\":3},\"kind\":0}]}}"
    }
  }

  def encode(rawParameter: String) = {
    java.net.URLEncoder.encode(rawParameter, "utf-8")
  }
}